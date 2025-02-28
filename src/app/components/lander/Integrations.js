import React from 'react';
import styles from "@/app/components/lander/StepsSection.module.css";
import Image from "next/image";

const Integrations = () => {
    return (
        <div>
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

        </div>
    );
};

export default Integrations;