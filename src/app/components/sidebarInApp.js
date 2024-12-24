"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // Import usePathname for active link detection
import styles from "./sidebar.module.css";

const SidebarInApp = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname(); // Get the current pathname
    const router = useRouter(); // Initialize router for navigation

    const toggleMenu = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    const navigateTo = (path) => {
        router.push(path); // Navigate to the specified path
        setIsMenuOpen(false); // Close the menu after navigation
    };

    const handleLogout = () => {
        // Clear the token or user session from localStorage
        localStorage.removeItem("token"); // Assuming 'token' is the key used
        localStorage.removeItem("user"); // Clear any additional user data if needed

        // Redirect to the login page ("/")
        router.push("/");
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <img src="/logo.png" alt="Logo" />
            </div>
            <nav className={styles.nav}>
                <ul>
                    <li
                        className={`${styles.navItem} ${
                            pathname === "/home" ? styles.active : ""
                        }`}
                        onClick={() => navigateTo("/home")}
                    >
                        <img src="/home.png" alt="Home" className={styles.icon} />
                        <span>Home</span>
                    </li>
                    <li
                        className={`${styles.navItem} ${
                            pathname === "/videos" ? styles.active : ""
                        }`}
                        onClick={() => navigateTo("/videos")}
                    >
                        <img src="/videos.png" alt="My Videos" className={styles.icon} />
                        <span>My Videos</span>
                        <span className={styles.badge}>6</span>
                    </li>
                    <li
                        className={`${styles.navItem} ${
                            pathname === "/analytics" ? styles.active : ""
                        }`}
                        onClick={() => navigateTo("/analytics")}
                    >
                        <img src="/analytics.png" alt="Analytics" className={styles.icon} />
                        <span>Analytics</span>
                    </li>
                </ul>
            </nav>
            <div className={styles.profile}>
                <div className={styles.profileContent} onClick={toggleMenu}>
                    <img src="/profile.jpg" alt="John Doe" className={styles.profileImage} />
                    <p className={styles.profileName}>John Doe</p>
                </div>
                <div className={`${styles.popoutMenu} ${isMenuOpen ? styles.open : ""}`}>
                    <div className={styles.menuItem} onClick={() => navigateTo("/profile")}>
                        Profile
                    </div>
                    <div className={styles.menuItem} onClick={handleLogout}>
                        Logout
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SidebarInApp;
