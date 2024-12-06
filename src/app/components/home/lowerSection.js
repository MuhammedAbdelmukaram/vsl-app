"use client";
import React, { useState } from "react";
import Link from "next/link"; // Import Link component
import styles from "./lowerSection.module.css";

const ITEMS_PER_PAGE = 6;

const LowerSection = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedData = data.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className={styles.lowerSection}>
            <h2>Video Performance</h2>
            <div className={styles.table}>
                {paginatedData.map((video, index) => (
                    <Link href="/video" key={index}>
                        <div className={styles.row}>
                            <div className={styles.thumbnail}>
                                <img src={video.thumbnail} alt="Video thumbnail" />
                            </div>
                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <p className={styles.statValue}>{video.views}</p>
                                    <p className={styles.statLabel}>Views</p>
                                </div>
                                <div className={styles.statItem}>
                                    <p className={styles.statValue}>{video.uniqueViews}</p>
                                    <p className={styles.statLabel}>Unique Views</p>
                                </div>
                                <div className={styles.statItem}>
                                    <p className={styles.statValue}>{video.playRate}</p>
                                    <p className={styles.statLabel}>Play Rate</p>
                                </div>
                                <div className={styles.statItem}>
                                    <p className={styles.statValue}>{video.pitchRetention}</p>
                                    <p className={styles.statLabel}>Pitch Retention</p>
                                </div>
                                <div className={styles.statItem}>
                                    <p className={styles.statValue}>{video.engagement}</p>
                                    <p className={styles.statLabel}>Engagement</p>
                                </div>
                                <div className={styles.statItem}>
                                    <p className={styles.statValue}>{video.buttonClicks}</p>
                                    <p className={styles.statLabel}>Button Clicks</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`${styles.pageButton} ${
                            currentPage === index + 1 ? styles.active : ""
                        }`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LowerSection;
