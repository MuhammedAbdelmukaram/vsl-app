import React from "react";
import styles from "./analytics.module.css";

const VideoStats = ({ selectedVideo }) => {


    return (
        <div className={styles.statsContainer}>
            {[
                { label: "Total Views", value: "345,550" },
                { label: "Unique Views", value: "234.545" },
                { label: "Avg View Rate", value: "%50,5" },
                { label: "Avg Daily Views", value: "17,456" },
                { label: "Play Rate", value: "71.5%" },
                { label: "Pitch Retention", value: "36.5%" },

            ].map((stat, index) => (
                <div key={index} className={styles.statItem}>
                    <div className={styles.textDot}>
                        <span className={styles.label}>{stat.label}</span>
                        <div className={styles.dot}></div>
                    </div>

                    <span className={styles.value}>{stat.value}</span>
                </div>
            ))}
        </div>
    );
};

export default VideoStats;
