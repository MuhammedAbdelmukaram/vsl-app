import dbConnect from "@/lib/dbConnect";
import Video from "@/models/Video";

export async function PUT(request, context) {
    const { params } = context; // Await context before accessing params
    const id = params?.id;

    if (!id) {
        return new Response(
            JSON.stringify({ message: "Video ID is required" }),
            { status: 400 }
        );
    }

    try {
        await dbConnect();
        const body = await request.json();

        const updatedVideo = await Video.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedVideo) {
            return new Response(
                JSON.stringify({ message: "Video not found" }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(updatedVideo), { status: 200 });
    } catch (error) {
        console.error("Error updating video:", error);
        return new Response(
            JSON.stringify({ message: "Server error" }),
            { status: 500 }
        );
    }
}
