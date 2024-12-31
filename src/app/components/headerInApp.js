"use client";

import React from "react";
import { usePathname } from "next/navigation"; // Hook to get the current pathname
import styles from "./header.module.css";

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const HeaderInApp = ({ title }) => {
    const pathname = usePathname(); // Get the current route

    // Determine the title to display
    const currentPage = title
        ? `Videos <img src="/arrowRight.svg" alt="Arrow" style="width: 12px; height: 12px; margin: 0 5px;"/> <span style="font-size: 14px; font-weight: normal; color: #ED6300;">${title}</span>` // Use arrow icon and style video name
        : pathname === "/home"
            ? "Welcome <span style='font-weight: normal'>John Doe</span>"
            : capitalizeFirstLetter(pathname.replace("/", ""));

    return (
        <header className={styles.header}>
            <h1
                dangerouslySetInnerHTML={{
                    __html: currentPage,
                }}
                style={{ fontSize: "20px", display:"flex", alignItems:"center" }} // Make the header smaller
            ></h1>
            <div className={styles.actions}>
                <div className={styles.helpIcon}>?</div>
            </div>
        </header>
    );
};

export default HeaderInApp;
