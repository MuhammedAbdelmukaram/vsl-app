import { jwtVerify } from "jose";

export async function verifyToken(token) {
    try {
        if (!token || !process.env.JWT_SECRET) {
            console.error("Missing token or JWT_SECRET");
            return null;
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        return payload; // { id, email } from the JWT
    } catch (error) {
        console.error("Invalid Token:", error);
        return null;
    }
}
