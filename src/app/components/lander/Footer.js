import React from 'react';
import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.left}>
                <img src="/logo.png" alt="VSL Player Logo" className={styles.logo} />
                <span>VSL Player inc.</span>
            </div>
            <div className={styles.right}>
                <a href="/terms-of-service">Terms of Service</a>
                <a href="/privacy-policy">Privacy Policy</a>
            </div>
        </footer>
    );
};

export default Footer;
