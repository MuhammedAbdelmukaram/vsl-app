import dbConnect from "@/lib/dbConnect";
import Video from "@/models/Video";
import User from "@/models/User";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import { jwtVerify } from "jose";

function timeStringToSeconds(timeString) {
    const parts = timeString.split(":").map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
}

export const revalidate = 0;

export async function GET(req) {
    try {
        await dbConnect();

        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (!payload?.id) return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });

        const userId = payload.id;

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "6", 10);
        const skip = (page - 1) * limit;

        const totalCount = await Video.countDocuments({ user: userId });
        const paginatedVideos = await Video.find({ user: userId }).skip(skip).limit(limit);
        const user = await User.findById(userId).select("favoredIntegrations");

        const results = [];

        for (const video of paginatedVideos) {
            const videoId = video._id.toString();
            const videoDuration = video.length ? timeStringToSeconds(video.length) : 0;
            const pitchTime = video.pitchTime ? timeStringToSeconds(video.pitchTime) : 60;

            const baseQuery = { media_id: videoId, accountId: video.user };

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
            const pitchRetention = playedSessionIds.length > 0
                ? (pitchHits.length / playedSessionIds.length) * 100
                : 0;

            const hookHits = await AnalyticsEvent.countDocuments({
                ...baseQuery,
                event: "timed",
                "data.time": { $gte: 15 },
            });
            const hookRetention = totalViews > 0 ? (hookHits / totalViews) * 100 : 0;

            results.push({
                id: videoId,
                name: video.name,
                thumbnail: video.thumbnail || "/default-thumbnail.jpg",
                views: totalViews,
                uniqueViews,
                playRate,
                avgWatchTime: averageWatchTime,
                engagement: hookRetention,
                buttonClicks: pitchRetention,
            });
        }

        return new Response(
            JSON.stringify({
                videos: results,
                totalCount,
                favoredIntegrations: user?.favoredIntegrations || [],
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error("[GET /api/getVideosHome] error", err);
        return new Response(JSON.stringify({ message: "Server error occurred" }), { status: 500 });
    }
}
