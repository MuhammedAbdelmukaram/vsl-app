import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Video from "@/models/Video";

export async function GET(request, context) {
    const { params } = context; // context holds params as a Promise
    const { id } = await params; // Await the params

    try {
        await dbConnect();
        const video = await Video.findById(id);

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        return NextResponse.json({
            url: video.videoUrl,
            thumbnail: video.thumbnail,
            exitThumbnail: video.exitThumbnail,
            autoPlayText: video.autoPlayText,
            brandColor: video.brandColor,
        });
    } catch (error) {
        console.error("Error fetching video:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
