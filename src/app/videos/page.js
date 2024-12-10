"use client";
import React, { useState, useEffect } from "react";
import styles from "./videos.module.css";
import Layout from "../components/LayoutHS";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const [videos, setVideos] = useState([]); // Store fetched videos
    const [activeFilter, setActiveFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const videosPerPage = 12;

    // Fetch videos on component load
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token = localStorage.getItem("token"); // Get JWT from local storage
                const response = await fetch("/api/getVideos", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch videos");
                }

                const videoData = await response.json();
                const formattedVideos = videoData.map((video) => ({
                    id: video._id, // Include the video ID
                    thumbnail: video.thumbnail || "/default-thumbnail.jpg",
                    title: video.name || "Untitled Video",
                    date: new Date(video.createdAt).toLocaleDateString(),
                    views: 0, // Placeholder
                }));
                setVideos(formattedVideos);
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };

        fetchVideos();
    }, []);

    const totalPages = Math.ceil(videos.length / videosPerPage);

    const filteredVideos = videos.slice(
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
        router.push(`/video/${id}`); // Navigate to specific video page with ID
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
                    {["All", "Active", "Inactive", "Favourite"].map((filter) => (
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
                            onClick={() => navigateToVideo(video.id)} // Pass video ID
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
                                <h3>{video.title}</h3>
                                <div className={styles.videoInfoLower}>
                                    <p className={styles.videoDate}>{video.date}</p>
                                    <p className={styles.videoViews}>
                                        {video.views}{" "}
                                        <span role="img" aria-label="views">
                                            👁️
                                        </span>
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
