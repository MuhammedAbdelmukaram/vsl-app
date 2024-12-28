import dbConnect from "@/lib/dbConnect";
import Video from "@/models/Video";
import { jwtVerify } from "jose";

export const revalidate = 0;

export async function POST(req) {
    try {
        // Connect to the database
        await dbConnect();

        // Get the Authorization header
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        // Extract the token
        const token = authHeader.split(" ")[1];

        // Decode the JWT to get the user ID
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (!payload.id) {
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
        }

        const userId = payload.id;

        // Parse the request body
        const body = await req.json();
        const { videoId } = body;

        if (!videoId) {
            return new Response(JSON.stringify({ message: "Video ID is required" }), { status: 400 });
        }

        // Find the video and toggle the favorite status
        const video = await Video.findOne({ _id: videoId, user: userId });

        if (!video) {
            return new Response(JSON.stringify({ message: "Video not found" }), { status: 404 });
        }

        video.favorite = !video.favorite; // Toggle the favorite status
        await video.save();

        return new Response(
            JSON.stringify({ message: "Favorite status updated", favorite: video.favorite }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error toggling favorite status:", error);
        return new Response(
            JSON.stringify({ message: "Server error occurred" }),
            { status: 500 }
        );
    }
}
