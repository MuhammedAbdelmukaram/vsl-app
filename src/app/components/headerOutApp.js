"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./headerOutApp.module.css";

const HeaderOutApp = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter(); // Next.js router

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogoClick = () => {
        router.push("/"); // Navigate to home
    };

    return (
        <header className={styles.header}>
            {/* Logo on the left */}
            <div className={styles.logo} onClick={handleLogoClick} style={{ cursor: "pointer" }}>
                <Image
                    src="/logo.png" // Replace with your logo path
                    alt="Logo"
                    width={40} // Base width
                    height={40} // Base height
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
                <div className={styles.navGap}>
                    <a href="/pricing" className={styles.navLink}>Pricing</a>
                    <a href="/login" className={styles.navLink}>Login</a>
                </div>
                <div style={{ height: "55px", width: 1, backgroundColor: "#5b5b5b" }}></div>
                <a href="/signup" className={styles.bookCall}>Try it now</a>
            </nav>
        </header>
    );
};

export default HeaderOutApp;
