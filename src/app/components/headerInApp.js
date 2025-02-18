"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import HelpModal from "./HelpModal"; // Import the new modal component
import styles from "./header.module.css";

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const HeaderInApp = ({ title }) => {
    const pathname = usePathname();
    const [isModalOpen, setModalOpen] = useState(false);

    const currentPage = title
        ? `Videos <img src="/arrowRight.svg" alt="Arrow" style="width: 12px; height: 12px; margin: 0 5px;"/> <span style="font-size: 14px; font-weight: normal; color: #6b6a6a;">${title}</span>`
        : pathname === "/home"
            ? "Welcome <span style='font-weight: normal'>John Doe</span>"
            : capitalizeFirstLetter(pathname.replace("/", ""));

    return (
        <>
            <header className={styles.header}>
                <h1
                    dangerouslySetInnerHTML={{
                        __html: currentPage,
                    }}
                    style={{ fontSize: "20px", display: "flex", alignItems: "center" }}
                ></h1>
                <div className={styles.actions}>
                    <div
                        className={styles.helpIcon}
                        onClick={() => setModalOpen(true)}
                        style={{
                            cursor: "pointer",
                            color: "white",
                            width: "25px",
                            height: "25px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            fontWeight: "bold",
                            fontSize: "16px"
                        }}
                    >
                        ?
                    </div>
                </div>
            </header>

            {/* Imported HelpModal Component */}
            <HelpModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
};

export default HeaderInApp;
