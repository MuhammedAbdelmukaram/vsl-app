import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import AnalyticsEvent from "@/models/AnalyticsEvent";

const DEVICE_COLORS = {
    Mobile: "#7D5FFF",
    Desktop: "#2ECC71",
    Tablet: "#F1C40F",
};

const BROWSER_GROUPS = {
    Safari: ["Safari"],
    Chrome: ["Chrome", "Chromium"],
    Opera: ["Opera"],
    Android: ["Samsung Internet", "Android"],
    Edge: ["Edge", "Microsoft Edge"],
};

function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function formatData(countMap, colorMap = {}) {
    return Object.entries(countMap).map(([name, value]) => ({
        name,
        value,
        color: colorMap[name] || getRandomColor(),
    }));
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get("videoId");
        const accountId = searchParams.get("accountId");
        const from = new Date(searchParams.get("from"));
        const to = new Date(searchParams.get("to"));

        if (!videoId || !accountId || isNaN(from) || isNaN(to)) {
            return NextResponse.json(
                { error: "Missing or invalid parameters" },
                { status: 400 }
            );
        }

        await dbConnect();

        const baseQuery = {
            media_id: videoId,
            accountId,
            event: "played",
            createdAt: { $gte: from.getTime(), $lte: to.getTime() },
        };

        const events = await AnalyticsEvent.find(baseQuery);

        const pageviewEvents = await AnalyticsEvent.find({
            media_id: videoId,
            accountId,
            event: "pageview",
            createdAt: { $gte: from.getTime(), $lte: to.getTime() },
        });

        const deviceCounts = {};
        const browserPlayedCounts = {};
        const browserPageviews = {};
        const countryCounts = {};
        const heatmapCounts = {};

        for (const ev of events) {
            if (ev.deviceType) {
                deviceCounts[ev.deviceType] = (deviceCounts[ev.deviceType] || 0) + 1;
            }

            if (ev.browser) {
                let group = "Other";
                for (const [key, variants] of Object.entries(BROWSER_GROUPS)) {
                    if (variants.includes(ev.browser)) {
                        group = key;
                        break;
                    }
                }
                browserPlayedCounts[group] = (browserPlayedCounts[group] || 0) + 1;
            }

            if (ev.country) {
                countryCounts[ev.country] = (countryCounts[ev.country] || 0) + 1;
            }

            const date = new Date(ev.createdAt);
            const day = date.getDay();
            const hour = date.getHours();
            const key = `${day}-${hour}`;
            heatmapCounts[key] = (heatmapCounts[key] || 0) + 1;
        }

        for (const ev of pageviewEvents) {
            if (ev.browser) {
                let group = "Other";
                for (const [key, variants] of Object.entries(BROWSER_GROUPS)) {
                    if (variants.includes(ev.browser)) {
                        group = key;
                        break;
                    }
                }
                browserPageviews[group] = (browserPageviews[group] || 0) + 1;
            }
        }

        const deviceData = formatData(deviceCounts, DEVICE_COLORS);

        const uniqueBrowsers = new Set([
            ...Object.keys(browserPlayedCounts),
            ...Object.keys(browserPageviews),
        ]);

        const browserData = Array.from(uniqueBrowsers).map((browserName) => ({
            name: browserName,
            value: browserPlayedCounts[browserName] || 0,
            sessions: browserPageviews[browserName] || 0,
        }));

        const countryData = Object.entries(countryCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        const heatmapData = Object.entries(heatmapCounts).map(([key, count]) => {
            const [day, hour] = key.split("-").map(Number);
            return { day, hour, count };
        });

        return NextResponse.json({
            deviceData,
            browserData,
            countryData,
            heatmapData,
        });
    } catch (err) {
        console.error("[API Error] /analytics/statistics-section:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}