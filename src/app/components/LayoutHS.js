"use client"
import React from "react";
import HeaderInApp from "./headerInApp";
import SidebarInApp from "./sidebarInApp";
import styles from "./layoutHS.module.css";

const LayoutHS = ({ children }) => {
    return (
        <div className={styles.layout}>
            <SidebarInApp />
            <div className={styles.mainContent}>
                <HeaderInApp />
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};

export default LayoutHS;
