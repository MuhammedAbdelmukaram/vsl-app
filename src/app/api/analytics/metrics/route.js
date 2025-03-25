// File: /app/api/analytics/metrics/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import AnalyticsEvent from "@/models/AnalyticsEvent";

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const accountId = searchParams.get("accountId");
        const filter = searchParams.get("filter") || "Total Views";

        if (!from || !to || !accountId) {
            return NextResponse.json({ error: "Missing required params" }, { status: 400 });
        }

        // Map filters to actual events in your schema
        const filterEventMap = {
            "Total Views": "played",
            "Play Rate": "played",
            "Avg View Rate": "timed",
            "Pitch Retention": "timed",
            "Page Views": "pageview",
        };

        const eventType = filterEventMap[filter];

        if (!eventType) {
            return NextResponse.json({ error: "Invalid filter type" }, { status: 400 });
        }

        const match = {
            accountId,
            event: eventType,
            createdAt: {
                $gte: Number(new Date(from)),
                $lte: Number(new Date(to)),
            },
        };

        const results = await AnalyticsEvent.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: { $toDate: "$createdAt" },
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return NextResponse.json(results);
    } catch (err) {
        console.error("Analytics Metrics API Error:", err);
        return NextResponse.json({ error: "Failed to fetch analytics metrics" }, { status: 500 });
    }
}