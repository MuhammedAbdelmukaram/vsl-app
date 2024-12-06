"use client";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import styles from "./CompanyMarque.module.css";

const CompanyMarquee = () => (
    <footer className={styles.footer}>
        <Marquee gradient={false} speed={50}>
            <div className={styles.partnerLogos}>
                <a href="https://acuired.com/" target="_blank" rel="noopener noreferrer">
                    <Image src="/acuiredLogo.svg" alt="Partner 1" width={40} height={13} className={styles.logo} />
                </a>
                <a href="https://dealfuel.io" target="_blank" rel="noopener noreferrer">
                    <Image src="/Plogo2.png" alt="Partner 2" width={50} height={50} className={styles.logo} />
                </a>
                <a href="https://astrosphere.io/about-faruk" target="_blank" rel="noopener noreferrer">
                    <Image src="/Plogo3.png" alt="Partner 3" width={50} height={50} className={styles.logo} />
                </a>
                <a href="https://supplierhq.io/" target="_blank" rel="noopener noreferrer">
                    <Image src="/supplierLogo.svg" alt="Partner 4" width={50} height={50} className={styles.logo} />
                </a>
                <a href="https://www.trustpilot.com/review/infofreedom.io" target="_blank" rel="noopener noreferrer">
                    <Image src="/Plogo5.png" alt="Partner 5" width={50} height={50} className={styles.logo} />
                </a>
            </div>
        </Marquee>
    </footer>
);

export default CompanyMarquee;
