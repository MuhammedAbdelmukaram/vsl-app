"use client";
import React, { useState, useEffect } from "react";
import styles from "./videos.module.css";
import Layout from "../components/LayoutHS";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const [videos, setVideos] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
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
                    title: video.name || "Untitled Video",
                    date: new Date(video.createdAt).toLocaleDateString(),
                    views: 0,
                    favorite: video.favorite || false,
                }));
                setVideos(formattedVideos);
            } catch (error) {
                console.error("Error fetching videos:", error);
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

    const totalPages = Math.ceil(
        videos.filter((video) =>
            activeFilter === "Favourite" ? video.favorite : true
        ).length / videosPerPage
    );

    const filteredVideos = videos
        .filter((video) => {
            if (activeFilter === "Favourite") return video.favorite;
            return true;
        })
        .slice(
            (currentPage - 1) * videosPerPage,
            currentPage * videosPerPage
        );

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

    return (
        <Layout>
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1>My Videos</h1>
                    <button className={styles.addButton} onClick={navigateToUpload}>
                        <img
                            src="/videos.png"
                            alt="Add New Video"
                            className={styles.buttonImage}
                        />
                        Add New Video
                    </button>
                </div>
                <p className={styles.description}>List of all your videos</p>
                <div className={styles.filters}>
                    {["All", "Favourite"].map((filter) => (
                        <button
                            key={filter}
                            className={`${styles.filterButton} ${
                                activeFilter === filter ? styles.active : ""
                            }`}
                            onClick={() => handleFilterClick(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className={styles.videoGrid}>
                    {filteredVideos.map((video, index) => (
                        <div
                            className={styles.videoCard}
                            key={index}
                            onClick={() => navigateToVideo(video.id)}
                        >
                            <div className={styles.videoThumbnail}>
                                <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    layout="fill"
                                    objectFit="cover"
                                    priority
                                />
                            </div>
                            <div className={styles.videoInfo}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <h3>{video.title}</h3>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(video.id);
                                        }}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: "0",
                                        }}
                                    >
                                        <img
                                            src={video.favorite ? "/favorite.png" : "/unfavorite.png"}
                                            alt={video.favorite ? "Favorited" : "Not Favorited"}
                                            style={{ width: "16px", height: "16px" }}
                                        />
                                    </button>
                                </div>
                                <div className={styles.videoInfoLower}>
                                    <p className={styles.videoDate}>{video.date}</p>
                                    <p className={styles.videoViews}>
                                        {video.views}{" "}
                                        <Image
                                            src="/viewIcon.png"
                                            alt="Partner 1"
                                            width={13}
                                            height={13}
                                            className={styles.logo}
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.pagination}>
                    {[...Array(totalPages).keys()].map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.paginationButton} ${
                                currentPage === index + 1 ? styles.active : ""
                            }`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Page;
