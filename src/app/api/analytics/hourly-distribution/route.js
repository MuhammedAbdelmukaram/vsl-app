import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import { format } from "date-fns";

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

        const baseQuery = {
            media_id: videoId,
            accountId,
            event: "played",
            createdAt: {
                $gte: from.getTime(),
                $lte: to.getTime(),
            },
        };

        const events = await AnalyticsEvent.find(baseQuery).select("createdAt");

        const heatmap = {};

        for (const ev of events) {
            const date = format(new Date(ev.createdAt), "yyyy-MM-dd");
            heatmap[date] = (heatmap[date] || 0) + 1;
        }

        const result = Object.entries(heatmap).map(([date, count]) => ({ date, count }));

        return NextResponse.json(result);
    } catch (err) {
        console.error("[API Error] /analytics/hourly-distribution:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
