"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./sidebar.module.css";

const SidebarInApp = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [videoCount, setVideoCount] = useState(0);
    const pathname = usePathname();
    const router = useRouter();

    const toggleMenu = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    const navigateTo = (path) => {
        router.push(path);
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    useEffect(() => {
        const fetchVideoCount = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("/api/getVideosCount", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch video count");

                const data = await response.json();
                setVideoCount(data.count);
            } catch (error) {
                console.error("Error fetching video count:", error);
            }
        };

        fetchVideoCount();
    }, []);

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
                        <span className={styles.badge}>{videoCount}</span>
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
                    <div className={styles.menuItem} onClick={() => navigateTo("/plans")}>
                        Plans
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
