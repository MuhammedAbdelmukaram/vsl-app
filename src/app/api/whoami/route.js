import { verifyToken } from "@/utils/verifyToken";

export async function GET(request) {
    try {
        // Get token from request headers
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("No valid Authorization header found");
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const token = authHeader.split(" ")[1]; // ✅ Extract token
        console.log("Received Token:", token); // Debugging

        const user = await verifyToken(token); // ✅ Verify with JOSE

        if (!user) {
            console.error("Token verification failed");
            return new Response(JSON.stringify({ error: "Invalid token" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching user info:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
