import React from "react";
import styles from "./analytics.module.css";

const VideoModal = ({ videos, setSelectedVideo, setIsModalOpen }) => (
    <div className={styles.modalOverlay}>
        <div className={styles.modal}>
            <h3>Select a Video</h3>
            <div className={styles.videoList}>
                {videos.map((video) => (
                    <div
                        key={video._id}
                        className={styles.modalVideoCard}
                        onClick={() => {
                            setSelectedVideo(video);
                            setIsModalOpen(false);
                        }}
                    >
                        <img src={video.thumbnail} alt={video.name} className={styles.modalThumbnail} />
                        <p className={styles.videoName}>{video.name}</p>
                    </div>
                ))}
            </div>
            <button className={styles.metric} onClick={() => setIsModalOpen(false)}>
                Close
            </button>
        </div>
    </div>
);

export default VideoModal;
