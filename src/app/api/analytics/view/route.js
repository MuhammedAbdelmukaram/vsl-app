import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Analytics from "@/models/Analytics";

// POST /api/analytics/view


export async function POST(req) {
    try {
        const { videoId } = await req.json();
        if (!videoId) return NextResponse.json({ error: "Missing videoId" }, { status: 400 });

        await dbConnect();

        const today = new Date().toISOString().split("T")[0];
        await Analytics.findOneAndUpdate(
            { video: videoId, date: today },
            { $inc: { totalViews: 1 } },
            { upsert: true, new: true }
        );

        return new NextResponse(
            JSON.stringify({ message: "View recorded successfully" }),
            { headers: { "Access-Control-Allow-Origin": "*" }, status: 200 }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: "Failed to log view" }),
            { headers: { "Access-Control-Allow-Origin": "*" }, status: 500 }
        );
    }
}


// Method not allowed for other HTTP verbs
export function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
