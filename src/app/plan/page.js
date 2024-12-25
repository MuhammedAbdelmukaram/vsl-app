"use client";
import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const PlanContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const priceId = searchParams.get("priceId");
    const planName = searchParams.get("planName");
    const billingPeriod = searchParams.get("billingPeriod");

    useEffect(() => {
        const handleCheckout = async () => {
            if (priceId && planName && billingPeriod) {
                const stripe = await stripePromise;

                try {
                    const response = await fetch("/api/create-checkout-session", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
                router.push("/pricing"); // Redirect to pricing page if data is missing
            }
        };

        handleCheckout();
    }, [priceId, planName, billingPeriod, router]);

    return <div>Processing your plan...</div>;
};

const PlanPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PlanContent />
        </Suspense>
    );
};

export default PlanPage;
