// pages/api/dbTest.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export const revalidate = 0;

export async function GET() {
    try {
        // Connect to database
        await dbConnect();

        // Send a success message
        return NextResponse.json({ success: true, message: "Database connection successful" });
    } catch (error) {
        // Handle errors
        console.error("Database connection error:", error);
        return NextResponse.json({ success: false, message: "Database connection failed" }, { status: 500 });
    }
}
