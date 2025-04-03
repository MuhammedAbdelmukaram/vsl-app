import React, { useState } from "react";
import styles from "./analytics.module.css";

const VideoModal = ({ videos, setSelectedVideo, setIsModalOpen }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const videosPerPage = 12; // Change this to show more or fewer videos per page

    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);

    const totalPages = Math.ceil(videos.length / videosPerPage);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3>Select a Video</h3>
                <div className={styles.videoList}>
                    {currentVideos.map((video) => (
                        <div
                            key={video._id}
                            className={styles.modalVideoCard}
                            onClick={() => {
                                setSelectedVideo(video);
                                setIsModalOpen(false);
                            }}
                        >
                            <img
                                src={video.thumbnail}
                                alt={video.name}
                                className={styles.modalThumbnail}
                            />
                            <p className={styles.videoName}>{video.name}</p>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className={styles.pagination}>
                    <button
                        className={styles.paginationButton}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        ◀ Previous
                    </button>
                    <span className={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className={styles.paginationButton}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next ▶
                    </button>
                </div>

                <button className={styles.metric} onClick={() => setIsModalOpen(false)}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default VideoModal;
