import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const dynamic = "force-dynamic"; // required for cron jobs to run properly

export async function GET() {
    await dbConnect();

    const now = new Date();

    const expiredUsers = await User.updateMany(
        {
            plan: "trial",
            trialStartDate: { $lte: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) } // older than 14 days
        },
        {
            $set: { plan: "expired" }
        }
    );

    return new Response(
        JSON.stringify({
            message: `Marked ${expiredUsers.modifiedCount} users as expired.`,
        }),
        { status: 200 }
    );
}
