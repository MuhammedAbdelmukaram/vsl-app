import React from 'react';
import styles from "@/app/components/lander/VideoAnalyticsSection.module.css";
import Image from "next/image";

const QuoteSection = () => {
    return (
        <section className={styles.quoteSection}>
            <div className={styles.quoteBox}>
                <Image src="/chane.jpg" alt="Profile picture of satisfied user" width={200} height={200} className={styles.logo}/>
            </div>
            <div>


                <p className={styles.quote}>
                    <span className={styles.bold}>“ See Your Audience </span>Allows users to pick up where they left
                    off or rewatch, increasing overall engagement. “
                </p>
                <p className={styles.author}>Alex Backer <span className={styles.position}>CEO of TikTok, CTO of Facebook</span>
                </p>
            </div>
        </section>
    );
};

export default QuoteSection;