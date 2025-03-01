import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const body = await req.json();
        const { priceId, planName, metadata } = body; // Include planName

        if (!priceId || !planName) {
            return new Response(JSON.stringify({ error: 'Price ID and Plan Name are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        let sessionConfig = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home`,
            metadata,
        };

        if (planName === "Monthly") {
            // Subscription mode
            sessionConfig.mode = 'subscription';
        } else if (planName === "Lifetime") {
            // One-time payment mode
            sessionConfig.mode = 'payment';
        } else {
            return new Response(JSON.stringify({ error: 'Invalid plan type' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        return new Response(JSON.stringify({ id: session.id }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Stripe API Error:', error.message);
        return new Response(JSON.stringify({ error: { message: error.message } }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
