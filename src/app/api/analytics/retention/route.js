import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import Video from "@/models/Video"; // Make sure this path is correct

// 🔄 Utility to parse "4:54" into seconds
function parseTimeStringToSeconds(timeStr) {
    if (!timeStr || typeof timeStr !== "string") return 0;

    const parts = timeStr.split(":").map(Number).reverse();
    let seconds = 0;

    if (parts[0]) seconds += parts[0];       // seconds
    if (parts[1]) seconds += parts[1] * 60;  // minutes
    if (parts[2]) seconds += parts[2] * 3600; // hours

    return seconds;
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get("videoId");
        const accountId = searchParams.get("accountId");
        const device = searchParams.get("device");
        const browser = searchParams.get("browser");

        if (!videoId || !accountId) {
            return NextResponse.json({ error: "Missing videoId or accountId" }, { status: 400 });
        }

        await dbConnect();

        const video = await Video.findById(videoId).select("length");
        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        const videoLength = parseTimeStringToSeconds(video.length);

        // Apply filters
        const query = {
            media_id: videoId,
            accountId,
            event: "timed",
        };
        if (device) query.deviceType = device;
        if (browser) query.browser = browser;

        const allTimedEvents = await AnalyticsEvent.find(query);

        // Group all events by session
        const sessionToTimes = {};
        allTimedEvents.forEach(({ sessionId, data }) => {
            const time = Math.round(data?.time || 0);
            if (!sessionToTimes[sessionId]) {
                sessionToTimes[sessionId] = new Set();
            }
            sessionToTimes[sessionId].add(time);
        });

        // Fill missing seconds per session up to max viewed time
        const timeFrequency = {};
        Object.values(sessionToTimes).forEach((timeSet) => {
            const maxTime = Math.max(...timeSet);
            for (let t = 0; t <= maxTime; t++) {
                timeFrequency[t] = (timeFrequency[t] || 0) + 1;
            }
        });

        const totalSessions = Object.keys(sessionToTimes).length;
        const maxTimeSeen = Math.max(...Object.keys(timeFrequency).map(Number), 0);

        const retentionData = [];
        for (let t = 0; t <= maxTimeSeen; t++) {
            const count = timeFrequency[t] || 0;
            const retention = totalSessions > 0 ? (count / totalSessions) * 100 : 0;
            retentionData.push({ time: t, retention: Math.round(retention) });
        }

        return NextResponse.json({
            retentionData,
            videoLength,
        });

    } catch (err) {
        console.error("[Retention API Error]", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

