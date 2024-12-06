"use client";
import React, { useState } from "react";
import styles from "./videos.module.css";
import Layout from "../components/LayoutHS";
import Image from "next/image"; // Import Next.js Image
import { useRouter } from "next/navigation";

const videos = [
    // Sample video objects
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    {
        thumbnail: "/videoThumbnail.png",
        title: "Master Thumbnail Design",
        date: "12.4.2024",
        views: 564,
    },
    // Add more video objects here...
];

const Page = () => {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const videosPerPage = 12;

    const totalPages = Math.ceil(videos.length / videosPerPage);

    const filteredVideos = videos.slice(
        (currentPage - 1) * videosPerPage,
        currentPage * videosPerPage
    );

    const videosWithPlaceholders = [...filteredVideos];
    while (videosWithPlaceholders.length < videosPerPage) {
        videosWithPlaceholders.push(null);
    }

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    const navigateToUpload = () => {
        router.push("/upload"); // Navigate to /upload
    };

    const navigateToVideo = () => {
        router.push("/video"); // Navigate to /video
    };


    return (
        <Layout>
            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h1>My Videos</h1>
                    <button className={styles.addButton} onClick={navigateToUpload}>
                        <img src="/videos.png" alt="Add New Video" className={styles.buttonImage} />
                        Add New Video
                    </button>

                </div>
                <p className={styles.description}>
                    List of all gurus with prominent portfolios
                </p>
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
                    {videosWithPlaceholders.map((video, index) =>
                        video ? (
                            <div className={styles.videoCard} key={index}  onClick={navigateToVideo}>
                                <div className={styles.videoThumbnail}>
                                    <Image
                                        src={video.thumbnail}
                                        alt={video.title}
                                        layout="fill" // Ensures it covers the container
                                        objectFit="cover" // Ensures the image maintains aspect ratio
                                        priority // Optimizes for loading
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
                        ) : (
                            <div
                                className={`${styles.videoCard} ${styles.placeholder}`}
                                key={index}
                            />
                        )
                    )}
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
