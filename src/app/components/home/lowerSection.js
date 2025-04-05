"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./lowerSection.module.css";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 6;

const LowerSection = () => {
    const [videos, setVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const menuRef = useRef(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedVideoId, setSelectedVideoId] = useState(null);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const fetchVideos = async (page) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/getVideosHome?page=${page}&limit=${ITEMS_PER_PAGE}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { videos, totalCount } = await res.json();
            setVideos(videos);
            setTotalCount(totalCount);
        } catch (err) {
            console.error("Error fetching paginated videos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowClick = (event, videoId) => {
        event.preventDefault();
        setSelectedVideoId(videoId);
        setMenuPosition({ x: event.clientX, y: event.clientY });
        setMenuVisible(true);
    };

    const handleMenuClick = (action) => {
        if (action === "options") router.push(`/video/${selectedVideoId}`);
        else if (action === "analytics") router.push("/analytics");
        setMenuVisible(false);
    };

    const handleOutsideClick = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuVisible(false);
        }
    };

    if (loading) return  <div className={styles.loader}>
        <div className={styles.ring}></div>
    </div>;

    return (
        <div className={styles.lowerSection} onClick={handleOutsideClick}>
            <h2>Video Manager</h2>
            <div className={styles.table}>
                {videos.map((video, index) => (
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
                                <p className={styles.statValueSpecial}>{video.name || "Unknown"}</p>
                            </div>
                            <div className={styles.statItem}>
                                <p className={styles.statValue}>{video.views ?? "0"}</p>
                                <p className={styles.statLabel}>Total Plays</p>
                            </div>
                            <div className={styles.statItem}>
                                <p className={styles.statValue}>{video.uniqueViews ?? "0"}</p>
                                <p className={styles.statLabel}>Unique Plays</p>
                            </div>
                            <div className={styles.statItem}>
                                <p className={styles.statValue}>
                                    {video.playRate ? `${video.playRate.toFixed(1)}%` : "0%"}
                                </p>
                                <p className={styles.statLabel}>Play Rate</p>
                            </div>
                            <div className={styles.statItem}>
                                <p className={styles.statValue}>
                                    {video.avgWatchTime ? `${video.avgWatchTime.toFixed(1)}s` : "0s"}
                                </p>
                                <p className={styles.statLabel}>Avg Watch Time</p>
                            </div>
                            <div className={styles.statItem}>
                                <p className={styles.statValue}>
                                    {video.engagement ? `${video.engagement.toFixed(1)}%` : "0%"}
                                </p>
                                <p className={styles.statLabel}>Hook Retention</p>
                            </div>
                            <div className={styles.statItem}>
                                <p className={styles.statValue}>
                                    {video.buttonClicks ? `${video.buttonClicks.toFixed(1)}%` : "0%"}
                                </p>
                                <p className={styles.statLabel}>Pitch Retention</p>
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
