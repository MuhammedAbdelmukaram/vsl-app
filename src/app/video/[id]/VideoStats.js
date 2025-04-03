"use client";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import React from "react";
import styles from "./video.module.css";

const VideoStats = ({ videoId }) => {
    const router = useRouter();

    const handleViewAnalytics = () => {
        if (videoId) {
            router.push(`/analytics?videoId=${videoId}`);
        } else {
            router.push(`/analytics`); // Redirect without preloading if no videoId
        }
    };

    return (
        <div className={styles.stats}>

            <div className={styles.statsGrid}>
                <div className={styles.statsRow}>
                    <span></span>
                    <span className={styles.bold}>TOTAL</span>
                    <span className={styles.bold}>Last 24h</span>
                    <span className={styles.bold}>Last 7 days</span>
                    <span className={styles.bold}>Last 30 days</span>
                </div>
                <div className={styles.statsRow}>
                    <span>Total Views</span>
                    <span className={styles.normal}>345,550</span>
                    <span className={styles.green}>15,424</span>
                    <span className={styles.green}>15,424</span>
                    <span className={styles.green}>15,424</span>
                </div>
                <div className={styles.statsRow}>
                    <span>Play Rate</span>
                    <span className={styles.normal}>36.5%</span>
                    <span className={styles.green}>42.5%</span>
                    <span className={styles.green}>42.5%</span>
                    <span className={styles.green}>42.5%</span>
                </div>
                <div className={styles.statsRow}>
                    <span>Avg View Rate</span>
                    <span className={styles.normal}>345,550</span>
                    <span className={styles.green}>42.5%</span>
                    <span className={styles.green}>42.5%</span>
                    <span className={styles.green}>42.5%</span>
                </div>
                <div className={styles.statsRow}>
                    <span>Pitch Retention</span>
                    <span className={styles.normal}>36.5%</span>
                    <span className={styles.green}>42.5%</span>
                    <span className={styles.green}>42.5%</span>
                    <span className={styles.green}>42.5%</span>
                </div>
                <div className={styles.statsRow}>
                    <span>Avg Daily Plays</span>
                    <span className={styles.normal}>345,550</span>
                    <span className={styles.green}>42.5%</span>
                    <span className={styles.green}>42.5%</span>
                    <span className={styles.green}>42.5%</span>
                </div>
                <div className={styles.statsRow}>
                    <span>Unique Views</span>
                    <span className={styles.normal}>36.5%</span>
                    <span className={styles.green}>42.5%</span>
                    <span className={styles.green}>42.5%</span>
                    <span className={styles.green}>42.5%</span>
                </div>
            </div>

        </div>
    );
};

export default VideoStats;
