import { NextResponse } from "next/server";

import Video from "@/models/Video";
import DeletedVideo from "@/models/DeletedVideo";
import dbConnect from "@/lib/dbConnect";

export async function POST(req, context) {
    console.log("Route Params (Promise):", context.params); // Debug params

    try {
        await dbConnect();

        // Await params to access videoId
        const { id: videoId } = await context.params;

        if (!videoId) {
            return NextResponse.json(
                { message: "Video ID is required." },
                { status: 400 }
            );
        }

        // Find the video by ID
        const video = await Video.findById(videoId);
        if (!video) {
            return NextResponse.json(
                { message: "Video not found." },
                { status: 404 }
            );
        }

        // Move the video to the DeletedVideo collection
        const deletedVideo = await DeletedVideo.create(video.toObject());

        // Remove the video from the original Video collection
        await Video.findByIdAndDelete(videoId);

        return NextResponse.json(
            {
                message: "Video moved to deleted collection successfully.",
                deletedVideo,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error moving video:", error);
        return NextResponse.json(
            { message: "Internal Server Error." },
            { status: 500 }
        );
    }
}
