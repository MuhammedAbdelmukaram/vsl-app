"use client";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation"; // To handle navigation
import HeaderOutApp from "@/app/components/headerOutApp";
import useAuth from "@/utils/useAuth"; // Hook to check login status
import styles from "./pricing.module.css";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const PricingPage = () => {
    const router = useRouter();
    const { isLoggedIn, loading } = useAuth(); // Check if the user is logged in
    const [isMonthly, setIsMonthly] = useState(true);

    const handlePlanClick = (priceId, planName, billingPeriod) => {
        const token = localStorage.getItem("token");

        if (!token || !isLoggedIn) {
            // Redirect to login with query parameters for plan details
            router.push(
                `/login?redirect=/plan&priceId=${priceId}&planName=${planName}&billingPeriod=${billingPeriod}`
            );
            return;
        }

        // Redirect logged-in user to plan page with plan metadata
        router.push(
            `/plan?priceId=${priceId}&planName=${planName}&billingPeriod=${billingPeriod}`
        );
    };

    if (loading) return <div>Loading...</div>; // Show loading state until auth check completes

    return (
        <div className={styles.pricingPage}>
            <HeaderOutApp />
            <div className={styles.container}>
                <h2 className={styles.title}>Make Your VSL Convert More</h2>
                <div className={styles.toggleContainer}>
                    <button
                        className={`${styles.toggleButton} ${isMonthly ? styles.active : ""}`}
                        onClick={() => setIsMonthly(true)}
                    >
                        Monthly
                    </button>
                    <button
                        className={`${styles.toggleButton} ${!isMonthly ? styles.active : ""}`}
                        onClick={() => setIsMonthly(false)}
                    >
                        Yearly
                    </button>
                </div>

                <div className={styles.pricingCards}>
                    <div className={styles.card}>
                        <h3 className={styles.planName}>Basic Plan</h3>
                        <p className={styles.priceOld}>$79</p>
                        <p className={styles.priceNew}>${isMonthly ? "59" : "49"}/month</p>
                        <ul className={styles.features}>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                        </ul>
                        <button
                            className={styles.startButton}
                            onClick={() =>
                                handlePlanClick(
                                    isMonthly
                                        ? "price_1QYeJoBpdFBuaaBzix5u7jQk" // Example Stripe price ID
                                        : "price_1QYeKRBpdFBuaaBzmWLZ3nkA",
                                    "Basic", // Plan name
                                    isMonthly ? "Monthly" : "Yearly" // Billing period
                                )
                            }
                        >
                            START FOR FREE
                        </button>
                    </div>

                    <div className={`${styles.card} ${styles.proPlan}`}>
                        <div className={styles.popularTag}>POPULAR</div>
                        <h3 className={styles.planName}>Pro Plan</h3>
                        <p className={styles.priceOld}>$150</p>
                        <p className={styles.priceNew}>${isMonthly ? "120" : "100"}/month</p>
                        <ul className={styles.features}>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                        </ul>
                        <button
                            className={styles.startButton}
                            onClick={() =>
                                handlePlanClick(
                                    isMonthly
                                        ? "price_1QYeKiBpdFBuaaBzKwckPObi" // Example Stripe price ID
                                        : "price_1QYeKrBpdFBuaaBzhaasMjT8",
                                    "Pro", // Plan name
                                    isMonthly ? "Monthly" : "Yearly" // Billing period
                                )
                            }
                        >
                            START FOR FREE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
