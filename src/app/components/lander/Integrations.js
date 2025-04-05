import React from 'react';
import styles from "@/app/components/lander/StepsSection.module.css";
import Image from "next/image";

const Integrations = () => {
    return (
        <div>
            <p className={styles.smallText}>Integrates with <span style={{fontWeight:"bold", textAlign:"center"}}> 100+ website builders </span> </p>
            <div className={styles.integrationContainer}>
                <div className={styles.logoIcon}>
                    <Image src="/s1.svg" alt="Webflow logo" height={50} width={50} />
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s2.svg" alt="WordPress logo" height={50} width={50} />
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s3.svg" alt="React logo" height={50} width={50} />
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s4.svg" alt="WooCommerce logo" height={50} width={50} />
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s5.svg" alt="Shopify logo" height={50} width={50} />
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s6.svg" alt="Squarespace logo" height={50} width={50} />
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s7.svg" alt="HighLevel logo" height={50} width={50} />
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s8.svg" alt="Wix logo" height={50} width={50} />
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s9.svg" alt="Next.js logo" height={50} width={50} />
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s10.svg" alt="Zapier logo" height={50} width={50} />
                </div>

                <div className={styles.logoIcon}>
                    <Image src="/s11.svg" alt="ClickFunnels logo" height={50} width={50} />
                </div>


            </div>

        </div>
    );
};

export default Integrations;