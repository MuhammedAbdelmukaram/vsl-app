"use client";
import React from "react";
import styles from "./videos.module.css";
import Image from "next/image";

const VideoGrid = ({
                       videos,
                       activeFilter,
                       currentPage,
                       videosPerPage,
                       setCurrentPage,
                       navigateToVideo,
                       toggleFavorite
                   }) => {
    const filteredVideos = videos
        .filter((video) => (activeFilter === "Favourite" ? video.favorite : true))
        .slice((currentPage - 1) * videosPerPage, currentPage * videosPerPage);

    const totalPages = Math.ceil(videos.filter(video => activeFilter === "Favourite" ? video.favorite : true).length / videosPerPage);

    return (
        <>
            {filteredVideos.length > 0 ? (
                <>
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
                                        alt={"video.title"}
                                        layout="fill"
                                        objectFit="cover"
                                        priority
                                    />
                                </div>
                                <div className={styles.videoInfo}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}>
                                        <h3 className={styles.title}>{video.name}</h3>
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
                                                alt="Views"
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
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ""}`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <p className={styles.noVideosText}>No videos found.</p>
            )}
        </>
    );
};

export default VideoGrid;
