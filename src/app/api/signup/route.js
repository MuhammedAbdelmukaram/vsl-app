import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { TextEncoder } from "util";

export const revalidate = 0;

export async function POST(request) {
    await dbConnect(); // Connect to the database

    try {
        // Parse incoming JSON data
        const { name, email, password } = await request.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ message: "User already exists." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save user to the database
        await newUser.save();

        // Ensure JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from .env file");
            return new Response(
                JSON.stringify({ message: "Server configuration error" }),
                { status: 500 }
            );
        }

        // Generate JWT Token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new SignJWT({ id: newUser._id, email: newUser.email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("72h")
            .sign(secret);

        // Return success response with token
        return new Response(
            JSON.stringify({
                token,
                user: { id: newUser._id, name: newUser.name, email: newUser.email },
                message: "User created successfully.",
            }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error while creating user:", error);
        return new Response(
            JSON.stringify({ message: "Server error occurred." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
