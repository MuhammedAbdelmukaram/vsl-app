import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Video from "@/models/Video";
import mongoose from "mongoose";

export async function POST(req) {
    await dbConnect(); // Connect to MongoDB

    try {
        const exampleVideo = {
            user: new mongoose.Types.ObjectId(), // Replace with a valid user ObjectId if necessary
            videoUrl: "/test.mp4", // Test video in your public folder
            thumbnail: "/thumbnail.jpg", // Example thumbnail
            exitThumbnail: "/exit-thumbnail.jpg", // Example exit thumbnail
            options: {
                fastProgressBar: true,
                autoPlay: true,
                showThumbnail: true,
                showExitThumbnail: true,
                exponentialProgress: true,
            },
            pitchTime: "02:45", // Example pitch time
            autoPlayText: "Click to Watch!", // Example autoplay text
            brandColor: "#ff5733", // Example brand color
            analytics: null, // Placeholder for analytics
        };

        // Insert into MongoDB
        const video = new Video(exampleVideo);
        await video.save();

        return NextResponse.json(
            { message: "Example video inserted successfully", video },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error inserting video:", error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
