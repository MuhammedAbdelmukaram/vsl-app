"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const PlanPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const priceId = searchParams.get("priceId");
    const planName = searchParams.get("planName"); // Retrieve plan name from query
    const billingPeriod = searchParams.get("billingPeriod"); // Retrieve billing period from query

    useEffect(() => {
        const handleCheckout = async () => {
            if (priceId && planName && billingPeriod) {
                const stripe = await stripePromise;

                try {
                    const response = await fetch("/api/create-checkout-session", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the user's token
                        },
                        body: JSON.stringify({ priceId, planName, billingPeriod }),
                    });

                    const session = await response.json();

                    if (session.id) {
                        stripe.redirectToCheckout({ sessionId: session.id });
                    } else {
                        console.error("Error creating checkout session:", session.error);
                    }
                } catch (error) {
                    console.error("Checkout error:", error);
                }
            } else {
                // Missing data, redirect to pricing page
                router.push("/pricing");
            }
        };

        handleCheckout();
    }, [priceId, planName, billingPeriod, router]);

    return <div>Processing your plan...</div>;
};

export default PlanPage;
