"use client"
import React, {useState} from 'react';
import styles from './plans.module.css'
import Layout from "@/app/components/LayoutHS";
const Page = () => {


    const [isMonthly, setIsMonthly] = useState(true);


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
                    <div className={styles.card}>
                        <h3 className={styles.planName}>Basic Plan</h3>
                        <div className={styles.prices}>
                            <p className={styles.priceOld}>$79</p>
                            <p className={styles.priceNew}>${isMonthly ? "59" : "49"}<span className={styles.month}>/month</span></p>

                        </div>
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
                        <div className={styles.prices}>
                            <p className={styles.priceOld}>$150</p>
                            <p className={styles.priceNew}>${isMonthly ? "120" : "100"}<span className={styles.month}>/month</span></p>
                        </div>
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
        </Layout>
    );
};

export default Page;