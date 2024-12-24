import dbConnect from "@/lib/dbConnect";
import Video from "@/models/Video";
import { jwtVerify } from "jose";
import mongoose from "mongoose";

export async function PUT(request) {
    try {
        // Verify JWT Token
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const userId = payload.id;
        if (!userId) {
            return new Response(JSON.stringify({ error: "User ID not found" }), { status: 400 });
        }

        // Parse Request Body
        const {
            videoId,
            thumbnail,
            exitThumbnail,
            options,       // New: Destructure options
            pitchTime,     // New: pitchTime
            autoPlayText,  // New: autoPlayText
            brandColor,    // New: brandColor
            iFrame,
        } = await request.json();

        if (!videoId) {
            return new Response(JSON.stringify({ error: "Video ID is required" }), { status: 400 });
        }

        // Convert videoId to ObjectId
        const objectId = new mongoose.Types.ObjectId(videoId);

        // Connect to Database
        await dbConnect();

        // Build update payload
        const updatePayload = {
            ...(thumbnail && { thumbnail }),
            ...(exitThumbnail && { exitThumbnail }),
            ...(options && { options }),
            ...(pitchTime && { pitchTime }),
            ...(autoPlayText && { autoPlayText }),
            ...(brandColor && { brandColor }),
            ...(iFrame && { iFrame }),
        };

        // Update Video
        const updatedVideo = await Video.findOneAndUpdate(
            { _id: objectId, user: userId },
            updatePayload, // Update these fields
            { new: true }
        );

        if (!updatedVideo) {
            return new Response(
                JSON.stringify({ error: "Video not found or unauthorized" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(updatedVideo), { status: 200 });
    } catch (error) {
        console.error("Error updating video:", error);
        return new Response(JSON.stringify({ error: "Failed to update video" }), { status: 500 });
    }
}
