import React from "react";
import styles from "./analytics.module.css";

const VideoStats = ({ selectedVideo }) => {
    if (!selectedVideo) return null;

    return (
        <div className={styles.statsContainer}>
            {[
                { label: "Total Views", value: "345,550" },
                { label: "Avg View Rate", value: "345,550" },
                { label: "Avg Daily Views", value: "345,550" },
                { label: "Play Rate", value: "36.5%" },
                { label: "Pitch Retention", value: "36.5%" },
                { label: "Unique Views", value: "36.5%" },
            ].map((stat, index) => (
                <div key={index} className={styles.statItem}>
                    <span className={styles.label}>{stat.label}</span>
                    <div className={styles.dot}></div>
                    <span className={styles.value}>{stat.value}</span>
                </div>
            ))}
        </div>
    );
};

export default VideoStats;
