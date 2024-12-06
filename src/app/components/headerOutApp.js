// components/Header.js
"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./HeaderOutApp.module.css";

const HeaderOutApp = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className={styles.header}>
            {/* Logo on the left */}
            <div className={styles.logo}>
                <Image
                    src="/logo.png" // Replace with your logo path
                    alt="Logo"
                    width={40} // Base width
                    height={40} // Base height
                    layout="intrinsic" // Ensures the image respects its aspect ratio
                    className={styles.logoImage}
                />
            </div>


            {/* Hamburger Menu for Mobile */}
            <div className={styles.hamburger} onClick={toggleMenu}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
            </div>

            {/* Navigation links */}
            <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
                <a href="pricing" className={styles.navLink}>Pricing</a>
                <a href="#testimonials" className={styles.navLink}>Testimonials</a>
                <a href="login" className={styles.navLink}>Login</a>
                <a href="signup" className={styles.bookCall}> Try it now</a>
            </nav>
        </header>
    );
};

export default HeaderOutApp;
