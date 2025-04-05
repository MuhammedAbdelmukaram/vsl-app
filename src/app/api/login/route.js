import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import { SignJWT } from "jose";
import { TextEncoder } from "util";
import bcrypt from "bcrypt";

export const revalidate = 0;

export async function POST(request) {
    await dbConnect();

    try {
        const { email, password } = await request.json();

        const user = await User.findOne({ email });
        if (!user) {
            return new Response(
                JSON.stringify({ message: "Invalid email or password." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(
                JSON.stringify({ message: "Invalid email or password." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ id: user._id, email: user.email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("72h")
            .sign(secret);

        // Set the cookie with the token
        const cookie = `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 72}`;

        return new Response(
            JSON.stringify({
                token,
                user: { id: user._id, name: user.name, email: user.email },
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": cookie,
                },
            }
        );
    } catch (error) {
        console.error("Error during login:", error);
        return new Response(
            JSON.stringify({ message: "Server error occurred." }),
            { status: 500 }
        );
    }
}
