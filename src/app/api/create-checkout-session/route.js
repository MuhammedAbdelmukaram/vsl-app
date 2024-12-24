import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const body = await req.json();
        const { priceId } = body;

        if (!priceId) {
            return new Response(JSON.stringify({ error: 'Price ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/home`,
        });

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
