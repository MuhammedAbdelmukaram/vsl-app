import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import AnalyticsEvent from "@/models/AnalyticsEvent";
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

export async function POST(req) {
    try {
        const { accountId, videoIds } = await req.json();

        if (!accountId || !videoIds || !Array.isArray(videoIds)) {
            return NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 });
        }

        await dbConnect();

        const results = [];

        for (const videoId of videoIds) {
            const video = await Video.findById(videoId);
            if (!video) continue;

            const videoDuration = video.length ? timeStringToSeconds(video.length) : 0;
            const pitchTime = video.pitchTime ? timeStringToSeconds(video.pitchTime) : 60;

            const baseQuery = { media_id: videoId, accountId };

            const totalViews = await AnalyticsEvent.countDocuments({ ...baseQuery, event: "played" });
            const uniqueViews = await AnalyticsEvent.distinct("device", { ...baseQuery, event: "played" }).then(res => res.length);
            const pageviews = await AnalyticsEvent.countDocuments({ ...baseQuery, event: "pageview" });
            const playRate = pageviews > 0 ? (totalViews / pageviews) * 100 : 0;

            const timedEvents = await AnalyticsEvent.find({ ...baseQuery, event: "timed" });
            const totalWatchTime = timedEvents.reduce((acc, ev) => acc + (ev.data?.time || 0), 0);
            const averageWatchTime = timedEvents.length > 0 ? totalWatchTime / timedEvents.length : 0;

            const pitchHits = await AnalyticsEvent.distinct("sessionId", {
                ...baseQuery,
                event: "timed",
                "data.time": { $gte: pitchTime },
            });
            const playedSessionIds = await AnalyticsEvent.distinct("sessionId", {
                ...baseQuery,
                event: "played",
            });
            const pitchRetention = playedSessionIds.length > 0 ? (pitchHits.length / playedSessionIds.length) * 100 : 0;

            const hookHits = await AnalyticsEvent.countDocuments({
                ...baseQuery,
                event: "timed",
                "data.time": { $gte: 15 },
            });
            const hookRetention = totalViews > 0 ? (hookHits / totalViews) * 100 : 0;

            results.push({
                id: videoId,
                views: totalViews,
                uniqueViews,
                playRate,
                avgWatchTime: averageWatchTime,
                engagement: hookRetention,
                buttonClicks: pitchRetention,
                name: video.name || null,
                thumbnail: video.thumbnail || null
            });
        }

        return NextResponse.json(results);
    } catch (err) {
        console.error("[API Error] /analytics/batch:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}