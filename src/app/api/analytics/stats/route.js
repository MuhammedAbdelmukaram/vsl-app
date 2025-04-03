import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import { startOfDay, endOfDay, eachDayOfInterval } from "date-fns";
import Video from "@/models/Video";

function timeStringToSeconds(timeString) {
    const parts = timeString.split(":").map(Number);
    if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;
        return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
        const [minutes, seconds] = parts;
        return minutes * 60 + seconds;
    } else {
        throw new Error("Invalid time format");
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get("videoId");
        const accountId = searchParams.get("accountId");
        const from = new Date(searchParams.get("from"));
        const to = new Date(searchParams.get("to"));

        if (!videoId || !accountId || isNaN(from) || isNaN(to)) {
            return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 });
        }

        await dbConnect();

        // 🧠 Get video details (needed for length and pitchTime)
        const video = await Video.findById(videoId);
        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        const videoDuration = video.length ? timeStringToSeconds(video.length) : 0;
        const pitchTime = video.pitchTime ? timeStringToSeconds(video.pitchTime) : 60; // fallback to 60s


        const baseQuery = {
            media_id: videoId,
            accountId,
            createdAt: { $gte: from.getTime(), $lte: to.getTime() },
        };

        const totalViews = await AnalyticsEvent.countDocuments({ ...baseQuery, event: "played" });
        const uniqueViews = await AnalyticsEvent.distinct("device", { ...baseQuery, event: "played" }).then(res => res.length);

        const pageviews = await AnalyticsEvent.countDocuments({ ...baseQuery, event: "pageview" });
        const uniquePageviews = await AnalyticsEvent.distinct("device", { ...baseQuery, event: "pageview" }).then(res => res.length);

        const playRate = pageviews > 0 ? (totalViews / pageviews) * 100 : 0;

        const finishedEvents = await AnalyticsEvent.find({ ...baseQuery, event: "finished" });

        // Track "timed" events to calculate Avg Watch Time and Avg View Rate
        const timedEvents = await AnalyticsEvent.find({ ...baseQuery, event: "timed" });

        // Calculate total watch time from all timed events
        const totalWatchTime = timedEvents.reduce((acc, ev) => acc + (ev.data?.time || 0), 0);
        const averageWatchTime = timedEvents.length > 0 ? totalWatchTime / timedEvents.length : 0;

        // Calculate Avg View Rate based on video length and Avg Watch Time
        const averageViewRate = videoDuration > 0 ? (averageWatchTime / videoDuration) * 100 : 0;


        // Calculation for pitch retention (how many sessions passed pitchTime)
        const pitchHits = await AnalyticsEvent.distinct("sessionId", {
            ...baseQuery,
            event: "timed",
            "data.time": { $gte: pitchTime },
        });
        const playedSessionIds = await AnalyticsEvent.distinct("sessionId", {
            ...baseQuery,
            event: "played"
        });
        const pitchRetention = playedSessionIds.length > 0
            ? (pitchHits.length / playedSessionIds.length) * 100
            : 0;

        // Average Daily Views (views per day within the given time range)
        const days = eachDayOfInterval({ start: startOfDay(from), end: endOfDay(to) });
        const avgDailyViews = totalViews > 0 ? totalViews / Math.max(days.length, 1) : 0;

        // Repeat View Rate
        const returnedWatchers = totalViews - uniqueViews;
        const repeatViewRate = uniqueViews > 0 ? (returnedWatchers / uniqueViews) * 100 : 0;

        // Hook Retention (watched past first 15 seconds)
        const hookHits = await AnalyticsEvent.countDocuments({
            ...baseQuery,
            event: "timed",
            "data.time": { $gte: 15 },
        });
        const hookRetention = totalViews > 0 ? (hookHits / totalViews) * 100 : 0;

        // Completion Rate (finished / total plays)
        const completionRate = totalViews > 0 ? (finishedEvents.length / totalViews) * 100 : 0;

        return NextResponse.json({
            totalViews,
            uniqueViews,
            pageviews,
            uniquePageviews,
            averageViewRate,
            averageDailyViews: avgDailyViews,
            playRate,
            pitchRetention,
            returnedWatchers,
            repeatViewRate,
            hookRetention,
            completionRate,
            averageWatchTime,
        });
    } catch (err) {
        console.error("[API Error] /analytics/stats:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

