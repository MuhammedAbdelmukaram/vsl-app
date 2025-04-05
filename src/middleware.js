import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/signup", "/api"];

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // Allow public files, Next.js internals, and public routes
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
    ) {
        return NextResponse.next();
    }

    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret); // throws if invalid
        return NextResponse.next();
    } catch (err) {
        console.error("Invalid token:", err);
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: [
        "/home",
        "/videos/:path*",
        "/ab-testing",
        "/analytics",
        "/embed",
        "/plans",
        "/faq",
        "/profile",
        "/upload",
        "/video/:path*", // protect specific video pages like /video/abc123
    ],
};
