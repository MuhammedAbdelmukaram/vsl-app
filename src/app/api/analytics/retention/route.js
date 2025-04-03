import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import AnalyticsEvent from "@/models/AnalyticsEvent";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get("videoId");
        const accountId = searchParams.get("accountId");

        if (!videoId || !accountId) {
            return NextResponse.json({ error: "Missing videoId or accountId" }, { status: 400 });
        }

        await dbConnect();

        const allTimedEvents = await AnalyticsEvent.find({
            media_id: videoId,
            accountId,
            event: "timed"
        });

        const sessionToTimes = {};

        // Group all time events by sessionId
        allTimedEvents.forEach(({ sessionId, data }) => {
            const time = Math.round(data?.time || 0);
            if (!sessionToTimes[sessionId]) {
                sessionToTimes[sessionId] = new Set();
            }
            sessionToTimes[sessionId].add(time);
        });

        // Now: fill all seconds up to max per session
        const timeFrequency = {};
        Object.values(sessionToTimes).forEach((timeSet) => {
            const maxTime = Math.max(...timeSet);
            for (let t = 0; t <= maxTime; t++) {
                timeFrequency[t] = (timeFrequency[t] || 0) + 1;
            }
        });

        const totalSessions = Object.keys(sessionToTimes).length;
        const maxTime = Math.max(...Object.keys(timeFrequency).map(Number), 0);

        const retentionData = [];
        for (let t = 0; t <= maxTime; t++) {
            const count = timeFrequency[t] || 0;
            const retention = totalSessions > 0 ? (count / totalSessions) * 100 : 0;
            retentionData.push({ time: t, retention: Math.round(retention) });
        }

        return NextResponse.json({ retentionData });
    } catch (err) {
        console.error("[Retention API Error]", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
