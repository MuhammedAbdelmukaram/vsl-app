"use client";
import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import Loader from "../loader/page"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const PlanContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const priceId = searchParams.get("priceId");
    const planName = searchParams.get("planName");
    const billingPeriod = searchParams.get("billingPeriod");



    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch("/api/getUserDetails", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user details");
                }

                const user = await response.json();
                console.log("User details:", user);
                return user;
            } catch (error) {
                console.error("Error fetching user details:", error);
                return null;
            }
        };

        const handleCheckout = async () => {
            if (priceId && planName && billingPeriod) {
                const stripe = await stripePromise;

                try {
                    // Fetch user details
                    const userDetails = await fetchUserDetails();

                    if (!userDetails) {
                        console.error("User details not available");
                        router.push("/pricing");
                        return;
                    }

                    const payload = {
                        priceId,
                        planName,
                        billingPeriod,
                        metadata: {
                            userId: userDetails._id,
                            email: userDetails.email,
                            name: userDetails.name,
                            plan: planName,
                        },
                    };

                    console.log("🛒 Stripe checkout payload:", payload); // 🧠 This logs what you're sending

                    const response = await fetch("/api/create-checkout-session", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify(payload),
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
        <Suspense fallback={<Loader />}>
            <PlanContent />
        </Suspense>
    );
};

export default PlanPage;
