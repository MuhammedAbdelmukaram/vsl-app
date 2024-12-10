import dbConnect from "@/lib/dbConnect";
import Video from "@/models/Video";
import { jwtVerify } from "jose";

export const revalidate = 0;

export async function GET(req) {
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

        // Fetch videos for the user
        const videos = await Video.find({ user: userId });

        return new Response(JSON.stringify(videos), { status: 200 });
    } catch (error) {
        console.error("Error fetching videos:", error);
        return new Response(
            JSON.stringify({ message: "Server error occurred" }),
            { status: 500 }
        );
    }
}
