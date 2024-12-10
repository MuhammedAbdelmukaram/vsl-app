import dbConnect from "@/lib/dbConnect";
import Video from "@/models/Video";

export async function GET(request, { params }) {
    const { id } = params;

    try {
        await dbConnect();
        const video = await Video.findById(id);

        if (!video) {
            return new Response(JSON.stringify({ message: "Video not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(video), { status: 200 });
    } catch (error) {
        console.error("Error fetching video:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
