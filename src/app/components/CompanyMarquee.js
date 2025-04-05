"use client";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import styles from "./CompanyMarque.module.css";

const CompanyMarquee = () => (
    <div className={styles.footer}>
        <Marquee gradient={false} speed={50}>
            <ul className={styles.partnerLogos}>
                <li>
                    <a href="https://acuired.com/" target="_blank" rel="noopener noreferrer">
                        <Image src="/acuiredLogo.svg" alt="Acuired logo" width={40} height={13} className={styles.logo} />
                    </a>
                </li>
                <li>
                    <a href="https://dealfuel.io" target="_blank" rel="noopener noreferrer">
                        <Image src="/Plogo2.png" alt="DealFuel logo" width={50} height={50} className={styles.logo} />
                    </a>
                </li>
                <li>
                    <a href="https://astrosphere.io/about-faruk" target="_blank" rel="noopener noreferrer">
                        <Image src="/Plogo3.png" alt="Astrosphere logo" width={50} height={50} className={styles.logo} />
                    </a>
                </li>
                <li>
                    <a href="https://supplierhq.io/" target="_blank" rel="noopener noreferrer">
                        <Image src="/supplierLogo.svg" alt="Supplier HQ logo" width={50} height={50} className={styles.logo} />
                    </a>
                </li>
                <li>
                    <a href="https://www.trustpilot.com/review/infofreedom.io" target="_blank" rel="noopener noreferrer">
                        <Image src="/Plogo5.png" alt="InfoFreedom Trustpilot logo" width={50} height={50} className={styles.logo} />
                    </a>
                </li>
            </ul>
        </Marquee>
    </div>
);

export default CompanyMarquee;
