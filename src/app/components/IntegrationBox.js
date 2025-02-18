import React from "react";
import styles from "../integrations/integrations.module.css";
import Image from "next/image";

const IntegrationBox = ({ photo, headline, status, description, onSelectIntegration }) => {
    const isConnected = status === "Connected";

    return (
        <div className={styles.selectedIntegration} onClick={() => !isConnected && onSelectIntegration(headline)}>
            <div className={styles.imageHeadline}>
                <img src={photo} alt={headline} className={styles.photo} />
                <div style={{ textAlign: "left" }}>
                    <h2 className={styles.headline}>{headline}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 12 }}>
                        <Image src="/clockIcon.png" alt="Time Icon" width={14} height={14} className={styles.logo} />
                        <p style={{ fontSize: 14 }}>{description}</p>
                    </div>
                </div>
            </div>

            {/* Status Indicator */}
            <span className={`${styles.status}`}>
                {isConnected ? (
                    <span className={styles.greenCircle}></span>
                ) : (
                    <span className={styles.redCircle}></span>
                )}
            </span>

            {/* Open Modal Instead of Redirecting */}
            <button
                className={styles.addButton}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent parent click from triggering
                    if (!isConnected) {
                        onSelectIntegration(headline); // Open the modal instead of navigating
                    }
                }}
                disabled={isConnected} // Disable button if already connected
                style={isConnected ? { cursor: "not-allowed", opacity: 0.6 } : {}}
            >
                {isConnected ? "Connected" : "Connect"}
            </button>
        </div>
    );
};

export default IntegrationBox;
