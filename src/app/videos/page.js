"use client";
import React, { useState, useEffect } from "react";
import styles from "./videos.module.css";
import Layout from "../components/LayoutHS";
import Loader from "../loader/page";
import { useRouter } from "next/navigation";
import VideoGrid from "./VideoGrid";
import LowerSection from "@/app/components/home/lowerSection"; // 🔥 Import Video Manager

const Page = () => {
    const router = useRouter();
    const [videos, setVideos] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid"); // 🔥 "grid" or "manager"
    const videosPerPage = 12;

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("/api/getVideos", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch videos");
                }

                const videoData = await response.json();
                const formattedVideos = videoData.map((video) => ({
                    id: video._id,
                    thumbnail: video.thumbnail || "/default-thumbnail.jpg",
                    name: video.name || "Untitled Video",
                    date: new Date(video.createdAt).toLocaleDateString(),
                    views: 0,
                    favorite: video.favorite || false,
                }));
                setVideos(formattedVideos);
            } catch (error) {
                console.error("Error fetching videos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const toggleFavorite = async (videoId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/toggleFavorite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ videoId }),
            });

            if (!response.ok) {
                throw new Error("Failed to toggle favorite");
            }

            const result = await response.json();

            setVideos((prevVideos) =>
                prevVideos.map((video) =>
                    video.id === videoId ? { ...video, favorite: result.favorite } : video
                )
            );
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    const navigateToUpload = () => {
        router.push("/upload");
    };

    const navigateToVideo = (id) => {
        router.push(`/video/${id}`);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <Layout>
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1>My Videos</h1>
                    <button className={styles.addButton} onClick={navigateToUpload}>
                        <img src="/videos.png" alt="Upload new video" className={styles.buttonImage} />
                        Add New Video
                    </button>
                </div>
                <p className={styles.description}>List of all your videos</p>

                {/* 📌 Filters & View Toggle Buttons */}
                <div className={styles.filtersContainer}>
                    <div className={styles.filters}>
                        {["All", "Favourite"].map((filter) => (
                            <button
                                key={filter}
                                className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ""}`}
                                onClick={() => handleFilterClick(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* 📌 View Mode Toggle Buttons */}
                    <div className={styles.viewToggleButtons}>
                        {/* Grid View Button */}
                        <button
                            className={`${styles.toggleButton} ${viewMode === "grid" ? styles.activeView : ""}`}
                            onClick={() => setViewMode("grid")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </button>

                        {/* Video Manager Button */}
                        <button
                            className={`${styles.toggleButton} ${viewMode === "manager" ? styles.activeView : ""}`}
                            onClick={() => setViewMode("manager")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div style={{ width: "100%", height: 1, backgroundColor: "#ffffff", marginBottom: 20 }} />

                {/* 🔥 Conditionally Render VideoGrid or Video Manager */}
                {viewMode === "grid" ? (
                    <VideoGrid
                        videos={videos}
                        activeFilter={activeFilter}
                        currentPage={currentPage}
                        videosPerPage={videosPerPage}
                        setCurrentPage={setCurrentPage}
                        navigateToVideo={navigateToVideo}
                        toggleFavorite={toggleFavorite}
                    />
                ) : (
                    <LowerSection data={videos} />
                )}

                {/* 📌 No Videos Message */}
                {videos.length === 0 && (
                    <div style={{
                        textAlign: "center",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "20vh",
                    }}>
                        <h2 style={{ fontWeight: "normal", color: "#C2C2C2", marginBottom: 20 }}>
                            No videos uploaded yet.
                        </h2>
                        <button className={styles.addButton} onClick={navigateToUpload}>
                            <img src="/videos.png" alt="Upload new video" className={styles.buttonImage} />
                            Upload Video
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Page;
