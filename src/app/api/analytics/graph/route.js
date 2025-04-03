// File: /app/api/analytics/graph/route.js

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
        const videoId = searchParams.get("videoId");
        const filter = (searchParams.get("filter") || "Total Plays").trim();


        if (!from || !to || !accountId || !videoId) {
            return NextResponse.json({ error: "Missing required params" }, { status: 400 });
        }

        const baseMatch = {
            accountId,
            media_id: videoId,
            createdAt: {
                $gte: Number(new Date(from)),
                $lte: Number(new Date(to)),
            },
        };

        const dateGroup = {
            $dateToString: {
                format: "%Y-%m-%d",
                date: { $toDate: "$createdAt" },
            },
        };

        // 🟧 Handle "Play Rate" manually by comparing plays vs pageviews per day
        if (filter === "Play Rate") {
            const [plays, pageviews] = await Promise.all([
                AnalyticsEvent.aggregate([
                    { $match: { ...baseMatch, event: "played" } },
                    {
                        $group: {
                            _id: dateGroup,
                            count: { $sum: 1 },
                        },
                    },
                ]),
                AnalyticsEvent.aggregate([
                    { $match: { ...baseMatch, event: "pageview" } },
                    {
                        $group: {
                            _id: dateGroup,
                            count: { $sum: 1 },
                        },
                    },
                ]),
            ]);

            const playMap = Object.fromEntries(plays.map(p => [p._id, p.count]));
            const pageviewMap = Object.fromEntries(pageviews.map(p => [p._id, p.count]));

            const allDates = new Set([...Object.keys(playMap), ...Object.keys(pageviewMap)]);
            const result = Array.from(allDates).sort().map(date => {
                const play = playMap[date] || 0;
                const view = pageviewMap[date] || 0;
                const rate = view > 0 ? (play / view) * 100 : 0;
                return { _id: date, count: Math.round(rate * 10) / 10 };
            });

            return NextResponse.json(result);
        }

        // Map filters to basic event types
        const filterEventMap = {
            "Page Views": "pageview",
            "Unique Page Views": "pageview",
            "Total Plays": "played",
            "Unique Plays": "played",
        };

        if (filter === "Returned Watchers") {
            // Get total plays per day
            const totalPlays = await AnalyticsEvent.aggregate([
                { $match: { ...baseMatch, event: "played" } },
                {
                    $group: {
                        _id: dateGroup,
                        count: { $sum: 1 },
                    },
                },
            ]);

            // Get unique devices per day
            const uniquePerDay = await AnalyticsEvent.aggregate([
                { $match: { ...baseMatch, event: "played" } },
                {
                    $group: {
                        _id: {
                            day: dateGroup,
                            device: "$device",
                        },
                    },
                },
                {
                    $group: {
                        _id: "$_id.day",
                        count: { $sum: 1 },
                    },
                },
            ]);

            const totalMap = Object.fromEntries(totalPlays.map(p => [p._id, p.count]));
            const uniqueMap = Object.fromEntries(uniquePerDay.map(p => [p._id, p.count]));

            const dateCursor = new Date(from);
            const endDate = new Date(to);
            const result = [];

            while (dateCursor <= endDate) {
                const dayStr = dateCursor.toISOString().split("T")[0];
                const total = totalMap[dayStr] || 0;
                const unique = uniqueMap[dayStr] || 0;
                const returned = Math.max(total - unique, 0);

                result.push({ _id: dayStr, count: returned });
                dateCursor.setDate(dateCursor.getDate() + 1);
            }

            return NextResponse.json(result);
        }


        const eventType = filterEventMap[filter];

        if (!eventType) {
            return NextResponse.json({ error: "Invalid filter type" }, { status: 400 });
        }

        const match = {
            ...baseMatch,
            event: eventType,
        };


        // 🟩 Handle unique metrics as total unique per period (NOT per day)
        if (filter.startsWith("Unique")) {
            const uniqueDevices = await AnalyticsEvent.distinct("device", match);
            const totalUnique = uniqueDevices.length;

            // Build the full date range for consistent chart labeling
            const dateCursor = new Date(from);
            const endDate = new Date(to);
            const dailyData = [];

            while (dateCursor <= endDate) {
                const dayStr = dateCursor.toISOString().split("T")[0]; // "YYYY-MM-DD"
                dailyData.push({ _id: dayStr, count: 0 }); // fill all with 0 for now
                dateCursor.setDate(dateCursor.getDate() + 1);
            }

            // Place the total unique count at the midpoint (or first date)
            if (dailyData.length > 0) {
                const midIndex = Math.floor(dailyData.length / 2);
                dailyData[midIndex].count = totalUnique;
            }

            return NextResponse.json(dailyData);
        }





        // 🟦 Default daily count for basic metrics
        const results = await AnalyticsEvent.aggregate([
            { $match: match },
            {
                $group: {
                    _id: dateGroup,
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
