// app/api/analytics/progress/route.js
import {NextResponse} from "next/server";

export async function POST(req) {
    const { videoId, currentTime, duration } = await req.json();
    console.log(`Progress for video: ${videoId}, Time: ${currentTime}/${duration}`);
    // Save to database or analytics platform
    return NextResponse.json({ success: true });
}
