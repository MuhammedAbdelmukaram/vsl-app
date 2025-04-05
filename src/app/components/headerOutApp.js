"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import styles from "./headerOutApp.module.css";
import Link from "next/link";

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
            <Link href="/" className={styles.logo}>
                <Image
                    src="/logo.png"
                    alt="VSL Player logo"
                    width={40}
                    height={40}
                    className={styles.logoImage}
                />
            </Link>


            {/* Hamburger Menu for Mobile */}
            <div
                className={styles.hamburger}
                onClick={toggleMenu}
                role="button"
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
                aria-controls="main-navigation"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") toggleMenu(); }}
            >

            <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
            </div>

            {/* Navigation links */}


            <nav aria-label="Main navigation" className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
                <ul className={styles.navGap}>
                    <li><Link href="/pricing" className={styles.navLink}>Pricing</Link></li>
                    <li><Link href="/guide" className={styles.navLink}>Guide</Link></li>
                    <li><Link href="/login" className={styles.navLink}>Login</Link></li>
                </ul>
                <div className={styles.line}></div>
                <Link href="/signup" className={styles.bookCall}>Try it now</Link>
            </nav>


        </header>
    );
};

export default HeaderOutApp;
