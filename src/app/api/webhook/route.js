import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-08-16" });

export const config = {
    api: {
        bodyParser: false, // Stripe requires the raw body for signature validation
    },
};

// Helper function for retry logic
const retryFindUser = async (query, maxRetries = 5, delay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const user = await User.findOne(query);
        if (user) return user;
        await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
    }
    return null;
};

export async function POST(request) {
    try {
        const { type, data } = await request.json();

        console.log("Webhook event received:", type);

        switch (type) {
            case "checkout.session.completed": {
                const session = data.object;

                const userId = session.metadata?.userId;
                const plan = session.metadata?.plan;

                if (!userId || !plan) {
                    console.error("Missing metadata: userId or plan");
                    break;
                }

                await dbConnect();

                const user = await User.findById(userId);
                if (!user) {
                    console.error(`User with ID ${userId} not found.`);
                    break;
                }

                user.plan = plan;
                user.stripeCustomerId = session.customer;
                user.stripeSubscriptionId = session.subscription;
                user.subscriptionStatus = "active"; // Initial status
                user.subscriptionStartDate = new Date();
                const subscription = await stripe.subscriptions.retrieve(session.subscription);
                if (subscription?.current_period_end) {
                    user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
                }
                await user.save();

                console.log(`User ${userId} plan updated to ${plan}`);
                break;
            }

            case "customer.subscription.created": {
                const subscription = data.object;

                await dbConnect();

                const user = await retryFindUser({ stripeCustomerId: subscription.customer });
                if (!user) {
                    console.error(`User with Stripe customer ID ${subscription.customer} not found.`);
                    break;
                }

                user.stripeSubscriptionId = subscription.id;
                user.subscriptionStatus = subscription.status;
                user.subscriptionStartDate = new Date(subscription.start_date * 1000);
                user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
                await user.save();

                console.log(`Subscription created for user ${user.email}`);
                break;
            }

            case "invoice.payment_succeeded": {
                const invoice = data.object;

                await dbConnect();

                const user = await retryFindUser({ stripeCustomerId: invoice.customer });
                if (!user) {
                    console.error(`User with Stripe customer ID ${invoice.customer} not found.`);
                    break;
                }

                const billingEntry = {
                    invoiceId: invoice.id,
                    amount: invoice.amount_paid / 100, // Convert to dollars
                    currency: invoice.currency,
                    status: "paid",
                    date: new Date(invoice.created * 1000),
                    plan: user.plan, // Retrieve and save the plan from the user's profile
                };

                user.billingHistory.push(billingEntry);
                await user.save();

                console.log(`Invoice ${invoice.id} recorded for user ${user.email}`);
                break;
            }

            case "customer.subscription.updated": {
                const subscription = data.object;

                await dbConnect();

                const user = await retryFindUser({ stripeCustomerId: subscription.customer });
                if (!user) {
                    console.error(`User with Stripe customer ID ${subscription.customer} not found.`);
                    break;
                }

                user.subscriptionStatus = subscription.status;
                user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
                await user.save();

                console.log(`Subscription updated for user ${user.email}`);
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = data.object;

                await dbConnect();

                const user = await retryFindUser({ stripeSubscriptionId: subscription.id });
                if (!user) {
                    console.error(`User with Stripe subscription ID ${subscription.id} not found.`);
                    break;
                }

                user.subscriptionStatus = "canceled";
                user.subscriptionEndDate = new Date();
                await user.save();

                console.log(`Subscription canceled for user ${user.email}`);
                break;
            }

            default:
                console.log(`Unhandled event type: ${type}`);
        }

        return NextResponse.json({ message: "Webhook processed successfully" });
    } catch (error) {
        console.error("Error processing webhook:", error.message);
        return NextResponse.json({ message: "Webhook processing error" }, { status: 500 });
    }
}
