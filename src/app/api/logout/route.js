// /app/api/logout/route.js
import { NextResponse } from "next/server";

export async function GET() {
    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.set("auth_token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/",
        expires: new Date(0), // Expire immediately
    });

    return response;
}
