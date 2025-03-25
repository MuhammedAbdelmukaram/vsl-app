"use client";
import React, { useState, useEffect } from "react";
import styles from "./plans.module.css";
import Layout from "@/app/components/LayoutHS";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const [isMonthly, setIsMonthly] = useState(true);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentPlan = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("/api/getProfile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCurrentPlan({
                        planName: data.plan,
                        billingPeriod: data.subscriptionEndDate
                            ? new Date(data.subscriptionEndDate) - new Date(data.subscriptionStartDate) > 2592000000 * 6
                                ? "Yearly"
                                : "Monthly"
                            : null,
                    });
                }
            } catch (err) {
                console.error("Error fetching current plan:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentPlan();
    }, []);

    const handlePlanClick = (priceId, planName, billingPeriod) => {
        router.push(
            `/plan?priceId=${priceId}&planName=${planName}&billingPeriod=${billingPeriod}`
        );
    };

    const isPlanSelected = (planName, billingPeriod) =>
        currentPlan?.planName === planName && currentPlan?.billingPeriod === billingPeriod;

    if (loading) return <p>Loading...</p>;

    return (
        <Layout>
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
                    {/* Basic Plan */}
                    <div className={styles.card}>
                        <h3 className={styles.planName}>Basic Plan</h3>
                        <div className={styles.prices}>
                            <p className={styles.priceOld}>$79</p>
                            <p className={styles.priceNew}>
                                ${isMonthly ? "59" : "49"}
                                <span className={styles.month}>/month</span>
                            </p>
                        </div>
                        <ul className={styles.features}>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                        </ul>
                        <button
                            className={`${styles.startButton} ${
                                isPlanSelected("Basic", isMonthly ? "Monthly" : "Yearly")
                                    ? styles.currentPlanButton
                                    : ""
                            }`}
                            onClick={() =>
                                handlePlanClick(
                                    isMonthly
                                        ? "price_1Qb0LiBpdFBuaaBzqg4JcfPN"
                                        : "price_1Qaf6EBpdFBuaaBzU5lPvG1t",
                                    "Basic",
                                    isMonthly ? "Monthly" : "Yearly"
                                )
                            }
                            disabled={isPlanSelected("Basic", isMonthly ? "Monthly" : "Yearly")}
                        >
                            {isPlanSelected("Basic", isMonthly ? "Monthly" : "Yearly")
                                ? "Current Plan"
                                : "START FOR FREE"}
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className={`${styles.card} ${styles.proPlan}`}>
                        <div className={styles.popularTag}>POPULAR</div>
                        <h3 className={styles.planName}>Pro Plan</h3>
                        <div className={styles.prices}>
                            <p className={styles.priceOld}>$150</p>
                            <p className={styles.priceNew}>
                                ${isMonthly ? "120" : "100"}
                                <span className={styles.month}>/month</span>
                            </p>
                        </div>
                        <ul className={styles.features}>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                            <li>Lorem ipsum</li>
                        </ul>
                        <button
                            className={`${styles.startButton} ${
                                isPlanSelected("Pro", isMonthly ? "Monthly" : "Yearly")
                                    ? styles.currentPlanButton
                                    : ""
                            }`}
                            onClick={() =>
                                handlePlanClick(
                                    isMonthly
                                        ? "price_1QYeKiBpdFBuaaBzKwckPObi"
                                        : "price_1Qaf5qBpdFBuaaBz40TS51PU",
                                    "Pro",
                                    isMonthly ? "Monthly" : "Yearly"
                                )
                            }
                            disabled={isPlanSelected("Pro", isMonthly ? "Monthly" : "Yearly")}
                        >
                            {isPlanSelected("Pro", isMonthly ? "Monthly" : "Yearly")
                                ? "Current Plan"
                                : "START FOR FREE"}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Page;
