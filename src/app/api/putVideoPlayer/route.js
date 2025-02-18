import { jwtVerify } from "jose"; // Add this import
import dbConnect from "@/lib/dbConnect";
import Video from "@/models/Video";

export async function PUT(request) {
    try {
        // Verify JWT Token
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        // Verify the JWT using jose's jwtVerify
        const { payload } = await jwtVerify(token, secret);

        const userId = payload.id;
        if (!userId) {
            return new Response(JSON.stringify({ error: "User ID not found" }), { status: 400 });
        }

        // Parse Request Body
        const { videoId, playerUrl } = await request.json();

        if (!videoId || !playerUrl) {
            return new Response(
                JSON.stringify({ error: "Video ID and Player URL are required" }),
                { status: 400 }
            );
        }

        // Connect to Database
        await dbConnect();

        // Update Video Player URL
        const updatedVideo = await Video.findOneAndUpdate(
            { _id: videoId, user: userId },
            { playerUrl },
            { new: true }
        );

        if (!updatedVideo) {
            return new Response(
                JSON.stringify({ error: "Video not found or unauthorized" }),
                { status: 404 }
            );
        }

        // Generate Signed URL for Uploading the Player
        const signedUrl = `${playerUrl}`;

        return new Response(
            JSON.stringify({ signedUrl }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating video player:", error);
        return new Response(JSON.stringify({ error: "Failed to update video player" }), { status: 500 });
    }
}
