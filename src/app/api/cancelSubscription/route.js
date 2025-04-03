import Stripe from "stripe";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-08-16" });

export async function POST(req) {
    try {
        const body = await req.json();
        const { subscriptionId, reasons } = body;

        if (!subscriptionId) {
            return new Response(
                JSON.stringify({ error: "Missing subscriptionId in request" }),
                { status: 400 }
            );
        }

        // Cancel the subscription in Stripe
        const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });

        // Update user in the database
        await dbConnect();
        const user = await User.findOne({ stripeSubscriptionId: subscriptionId });

        if (user) {
            user.subscriptionStatus = "canceled";
            user.subscriptionEndDate = new Date();
            user.plan = "Canceled";

            if (Array.isArray(reasons)) {
                user.cancellationFeedback = {
                    reasons,
                    canceledAt: new Date(),
                };
            }

            // Optionally update latest billing
            if (user.billingHistory?.length > 0) {
                const latestBilling = user.billingHistory[user.billingHistory.length - 1];
                latestBilling.status = "canceled";
                latestBilling.date = new Date();
            }

            await user.save();
        }

        return new Response(
            JSON.stringify({
                message: "Subscription cancellation scheduled successfully",
                canceledSubscription,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error canceling subscription:", error.message);
        return new Response(
            JSON.stringify({ error: "Failed to cancel subscription" }),
            { status: 500 }
        );
    }
}
