import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
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

        // Fetch the user profile based on the user ID
        const user = await User.findById(userId).select("-password"); // Exclude the password field

        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return new Response(
            JSON.stringify({ message: "Server error occurred" }),
            { status: 500 }
        );
    }
}
