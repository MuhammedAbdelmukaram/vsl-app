import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const dynamic = "force-dynamic"; // required for cron jobs to run properly

export async function GET(req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const now = new Date();

    const expiredUsers = await User.updateMany(
        {
            plan: "Free",
            trialStartDate: { $lte: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) }
        },
        {
            $set: { plan: "Expired" }
        }
    );

    return new Response(
        JSON.stringify({
            message: `Marked ${expiredUsers.modifiedCount} users as expired.`,
        }),
        { status: 200 }
    );
}

