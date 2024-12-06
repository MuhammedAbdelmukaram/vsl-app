import React from "react";
import styles from "./header.module.css";

const HeaderInApp = () => {
    return (
        <header className={styles.header}>
            <h1>Welcome <span style={{fontWeight:"normal"}}>John Doe</span></h1>
            <div className={styles.actions}>
                <div className={styles.helpIcon}>?</div>
            </div>
        </header>
    );
};

export default HeaderInApp;
