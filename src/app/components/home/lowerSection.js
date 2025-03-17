"use client";
import React, { useState, useRef } from "react";
import styles from "./lowerSection.module.css";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 6;

const LowerSection = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

    const router = useRouter();
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedData = data.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // 🔥 State to track the menu position & selected video
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const menuRef = useRef(null);

    // ✅ Open the menu at the clicked position
    const handleRowClick = (event, videoId) => {
        event.preventDefault();
        setSelectedVideoId(videoId);

        const { clientX, clientY } = event;
        setMenuPosition({ x: clientX, y: clientY });
        setMenuVisible(true);
    };

    // ✅ Handle menu option selection
    const handleMenuClick = (action) => {
        if (action === "options") {
            router.push(`/video/${selectedVideoId}`);
        } else if (action === "analytics") {
            router.push("/analytics");
        }
        setMenuVisible(false);
    };

    // ✅ Close the menu if clicking outside
    const handleOutsideClick = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuVisible(false);
        }
    };

    return (
        <div className={styles.lowerSection} onClick={handleOutsideClick}>
            <h2>Video Manager</h2>
            <div className={styles.table}>
                {paginatedData.map((video, index) => (
                    <div
                        className={styles.row}
                        key={index}
                        onClick={(event) => handleRowClick(event, video.id)}
                        style={{ cursor: "pointer" }}
                    >
                        <div className={styles.thumbnail}>
                            <img src={video.thumbnail || "/default-thumbnail.jpg"} alt="Video thumbnail" />
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <p className={styles.statValueSpecial}>
                                    {video.name || "Unknown"}
                                </p>
                            </div>
                            <div className={styles.statItem}>
                                <p className={styles.statValue}>{video.views ?? "0"}</p>
                                <p className={styles.statLabel}>Views</p>
                            </div>
                            <div className={styles.statItem}>
                                <p className={styles.statValue}>{video.uniqueViews ?? "0"}</p>
                                <p className={styles.statLabel}>Unique Views</p>
                            </div>
                            <div className={styles.statItem}>
                                <p className={styles.statValue}>{video.playRate ?? "0"}</p>
                                <p className={styles.statLabel}>Play Rate</p>
                            </div>
                            <div className={styles.statItem}>
                                <p className={styles.statValue}>{video.pitchRetention ?? "0"}</p>
                                <p className={styles.statLabel}>Pitch Retention</p>
                            </div>
                            <div className={styles.statItem}>
                                <p className={styles.statValue}>{video.engagement ?? "0"}</p>
                                <p className={styles.statLabel}>Engagement</p>
                            </div>
                            <div className={styles.statItem}>
                                <p className={styles.statValue}>{video.buttonClicks ?? "0"}</p>
                                <p className={styles.statLabel}>Button Clicks</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ""}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* 🔥 Small Context Menu */}
            {menuVisible && (
                <div
                    ref={menuRef}
                    className={styles.contextMenu}
                    style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
                >
                    <button onClick={() => handleMenuClick("options")}>Options</button>
                    <button onClick={() => handleMenuClick("analytics")}>Analytics</button>
                </div>
            )}
        </div>
    );
};

export default LowerSection;
