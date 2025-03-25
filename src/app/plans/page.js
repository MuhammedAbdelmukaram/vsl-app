"use client"
import React from 'react';
import styles from "@/app/pricing/pricing.module.css";
import HeaderOutApp from "@/app/components/headerOutApp";
import Image from "next/image";
import Integrations from "@/app/components/lander/Integrations";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation"; // To handle navigation
import useAuth from "@/utils/useAuth";
import Layout from "../components/LayoutHS"


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Page = () => {
    const router = useRouter();
    const { isLoggedIn, loading } = useAuth();


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



    return (
        <Layout>
        <div className={styles.pricingPage}>


            <div className={styles.gradient3}>
                <Image
                    src="/gradient.svg"
                    alt="Partner 4"
                    width={800}
                    height={800}
                    className={styles.logo}
                />
            </div>
            <div className={styles.container}>
                <p className={styles.eyebrow}>Start Your 14 Day Free Trial</p>
                <h2 className={styles.title}>Make Your VSL Convert More</h2>
                <p className={styles.text}>Getting just <span className={styles.highlightText}>1 more sale </span>from
                    it pays it off</p>


                <div className={styles.innerContainer} >

                    <div className={styles.checks}>


                        <div className={styles.checkpoint}>
                            <Image src="/pCheck.svg" alt="Partner 1" width={55} height={20} className={styles.logo}/>
                            <p><span className={styles.highlight}>Unlimited</span> Views per VSL</p>
                        </div>
                        <div className={styles.checkpoint}>
                            <Image src="/pCheck.svg" alt="Partner 1" width={55} height={20} className={styles.logo}/>
                            <p><span className={styles.highlight}>Unlimited</span> Video Uploads</p>
                        </div>
                        <div className={styles.checkpoint}>
                            <Image src="/pCheck.svg" alt="Partner 1" width={55} height={20} className={styles.logo}/>
                            <p><span className={styles.highlight}>Full Player Customization</span></p>
                        </div>
                        <div className={styles.checkpoint}>
                            <Image src="/pCheck.svg" alt="Partner 1" width={55} height={20} className={styles.logo}/>
                            <p>Advanced <span className={styles.highlight}>Analytics</span></p>
                        </div>
                        <div className={styles.checkpoint}>
                            <Image src="/pCheck.svg" alt="Partner 1" width={55} height={20} className={styles.logo}/>
                            <p>A/B Testing</p>
                        </div>
                        <div className={styles.checkpoint}>
                            <Image src="/pCheck.svg" alt="Partner 1" width={55} height={20} className={styles.logo}/>
                            <p><span className={styles.highlight}>Smart Progress Bar</span></p>
                        </div>
                        <div className={styles.checkpoint}>
                            <Image src="/pCheck.svg" alt="Partner 1" width={55} height={20} className={styles.logo}/>
                            <p>Unlimited Team Members</p>
                        </div>
                        <div className={styles.checkpoint}>
                            <Image src="/pCheck.svg" alt="Partner 1" width={55} height={20} className={styles.logo}/>
                            <p>Exit Thumbnail</p>
                        </div>
                        <div className={styles.checkpoint}>
                            <Image src="/pCheck.svg" alt="Partner 1" width={55} height={20} className={styles.logo}/>
                            <p><span className={styles.highlight}>Express Video Delivery</span></p>
                        </div>
                        <div className={styles.checkpoint}>
                            <Image src="/pCheck.svg" alt="Partner 1" width={55} height={20} className={styles.logo}/>
                            <p>Removed Branding</p>
                        </div>
                    </div>

                    <div className={styles.pricingCards}>


                        <div className={styles.card}>
                            <h3 className={styles.planName}>Basic Plan</h3>
                            <div className={styles.prices}>
                                <p className={styles.priceOld}>$79</p>
                                <p className={styles.priceNew}>$39</p>
                                <p className={styles.month}>/ month</p>
                            </div>


                            <button
                                className={styles.startButton}
                                onClick={() =>
                                    handlePlanClick(
                                        "price_1QxdOSBpdFBuaaBz9F0BTcbK", // Plan name
                                        "Monthly" ,
                                        "Monthly"// Billing period,

                                    )
                                }
                            >
                                Start 14 Days Free Trial
                            </button>
                        </div>


                        <div className={styles.cardS}>

                            <div className={styles.offer}>
                                <p className={styles.offerText}>
                                    Limited Time Only
                                </p>
                            </div>
                            <h3 className={styles.planName}>Lifetime Deal</h3>
                            <div className={styles.prices}>
                                <p className={styles.priceOld}>$499</p>
                                <p className={styles.priceNew}>$300</p>
                                <p className={styles.month}>/ forever</p>
                            </div>


                            <button
                                className={styles.startButton}
                                onClick={() =>
                                    handlePlanClick(
                                        "price_1QxdOmBpdFBuaaBzcxFMcJoY", // Plan name
                                        "Lifetime" ,
                                        "Lifetime"// Billing period,

                                    )
                                }
                            >
                                Start 14 Days Free Trial
                            </button>
                        </div>


                    </div>

                </div>


            </div>

            <div className={styles.integrations}>
                <Integrations/>
            </div>

        </div>
            </Layout>
    );
};

export default Page;