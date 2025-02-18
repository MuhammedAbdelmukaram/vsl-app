// app/api/analytics/completed/route.js
import {NextResponse} from "next/server";

export async function POST(req) {
    const { videoId } = await req.json();
    console.log(`Completion logged for video: ${videoId}`);
    // Save to database or analytics platform
    return NextResponse.json({ success: true });
}
