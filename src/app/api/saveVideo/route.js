import dbConnect from "@/lib/dbConnect";
import Video from "@/models/Video";
import { jwtVerify } from "jose";

export async function POST(request) {
    try {
        // 1. Verify JWT
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        // Extract `id` field from payload
        const userId = payload.id; // Corrected to match how you sign the token
        if (!userId) {
            return new Response(JSON.stringify({ error: "User ID not found in token" }), { status: 400 });
        }

        // 2. Parse Request Body
        const {
            name,
            videoUrl,
            thumbnail,
            exitThumbnail,
            options,
            pitchTime,
            autoPlayText,
            brandColor,
        } = await request.json();

        // 3. Connect to DB
        await dbConnect();

        // 4. Save New Video
        const newVideo = await Video.create({
            user: userId, // Required: User ID
            name, // Video Title
            videoUrl, // Cloudflare R2 video URL
            thumbnail,
            exitThumbnail,
            options: options || {}, // Default empty object
            pitchTime,
            autoPlayText,
            brandColor,
        });

        return new Response(JSON.stringify(newVideo), { status: 201 });
    } catch (error) {
        console.error("Error saving video:", error);
        return new Response(JSON.stringify({ error: "Failed to save video" }), { status: 500 });
    }
}
