import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { jwtVerify } from "jose";

export async function POST(req) {
    try {
        await dbConnect();

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (!payload.id) {
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
        }

        const userId = payload.id;
        const { integrations } = await req.json();

        if (!integrations || !Array.isArray(integrations)) {
            return new Response(JSON.stringify({ message: "Invalid data" }), { status: 400 });
        }

        await User.findByIdAndUpdate(userId, { favoredIntegrations: integrations });

        return new Response(JSON.stringify({ message: "Integrations saved successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error saving integrations:", error);
        return new Response(
            JSON.stringify({ message: "Server error occurred" }),
            { status: 500 }
        );
    }
}
