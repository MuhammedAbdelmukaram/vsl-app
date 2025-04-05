import styles from './StepsSection.module.css';
import Image from "next/image";
import React from "react";
import Integrations from "@/app/components/lander/Integrations";
const StepsSection = () => {
    return (
        <section className={styles.container}>
            <div className={styles.eyebrows}>
                <p>WORKS ON ANY WEBSITE</p>
            </div>
            <h3 className={styles.title}><span style={{color:"#d25801"}}>30 </span> seconds to add it</h3>
            <p className={styles.subtitle}>Lorem Ipsum</p>

            <div className={styles.stepsContainer}>
                <div className={styles.step}>
                    <Image src="/s1.svg" alt="Integration 1" height={50} width={90}/>
                    <h4 className={styles.stepTitle}>1. Upload Your VSL</h4>
                    <p className={styles.stepDescription}>
                        You can upload it from device or Google Drive
                    </p>
                </div>

                <div className={styles.step}>
                    <Image src="/s1.svg" alt="Integration 1" height={50} width={50}/>
                    <h4 className={styles.stepTitle}>2. Customize Your Player</h4>
                    <p className={styles.stepDescription}>
                        Choose features which work for you to maximize conversions
                    </p>
                </div>

                <div className={styles.step}>
                    <Image src="/s1.svg" alt="Integration 1" height={50} width={50}/>
                    <h4 className={styles.stepTitle}>3. Add Player to Your Website</h4>
                    <p className={styles.stepDescription}>
                        You can add it to virtually any website in less than 2 minutes.
                    </p>
                </div>
            </div>


            <Integrations/>
            <div className={styles.cta}>
                <button>Try For Free</button>
            </div>
            <div className={styles.checks}>
                <p>✓ Cancel Anytime</p>
                <p>✓ No Credit Card Required</p>
                <p>✓ 14-Day Free Trial</p>
            </div>


        </section>
    );
};

export default StepsSection;
