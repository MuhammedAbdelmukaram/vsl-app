import styles from './StepsSection.module.css';
import Image from "next/image";
import React from "react";
const StepsSection = () => {
    return (
        <div className={styles.container}>
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


            <p className={styles.smallText}>Integrates with <span style={{fontWeight:"bold"}}> 100+ website builders </span> </p>
            <div className={styles.integrationContainer}>
                <div className={styles.logoIcon}>
                    <Image src="/s1.svg" alt="Integration 1" height={50} width={50}/>
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s2.svg" alt="Integration 2" height={50} width={50} />
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s3.svg" alt="Integration 3" height={50} width={50}/>
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s4.svg" alt="Integration 4" height={50} width={50}/>
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s5.svg" alt="Integration 5" height={50} width={50}/>
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s6.svg" alt="Integration 6" height={50} width={50}/>
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s7.svg" alt="Integration 2" height={50} width={50}/>
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s8.svg" alt="Integration 3" height={50} width={50}/>
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s9.svg" alt="Integration 4" height={50} width={50}/>
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s10.svg" alt="Integration 5" height={50} width={50} />
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s11.svg" alt="Integration 6" height={50} width={50}/>
                </div>


            </div>

            <div className={styles.cta}>
                <button>Try For Free</button>
            </div>
            <div className={styles.checks}>
                <p>✓ Cancel Anytime</p>
                <p>✓ No Credit Card Required</p>
                <p>✓ 14-Day Free Trial</p>
            </div>


        </div>
    );
};

export default StepsSection;
