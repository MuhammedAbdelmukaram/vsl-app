import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import { jwtVerify } from "jose";

export async function GET(req) {
    try {
        await dbConnect();

        // Extract the token from the Authorization header
        const token = req.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) {
            return NextResponse.json(
                { message: "Authentication token is missing" },
                { status: 401 }
            );
        }

        // Verify and decode the token
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from .env file");
            return NextResponse.json(
                { message: "Server configuration error" },
                { status: 500 }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        // Find the user in the database using the decoded payload
        const user = await User.findById(payload.id).select("-password"); // Exclude password

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Return the user details
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
