import React from "react";
import Image from "next/image";
import styles from "./analytics.module.css";

const VideoSelector = ({ selectedVideo, setIsModalOpen }) => {
    return (
        <div className={styles.menuButton}>
            {selectedVideo ? (
                <div className={styles.topRow}>
                    <div
                        className={selectedVideo ? styles.selectedVideoCard : styles.unselectedVideoCard}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 16,
                            flexDirection: "row",
                            width: "auto",
                            backgroundColor: "#131313",
                            border: "1px solid #8D8D8D",
                        }}>
                            <div
                                className={styles.selectedThumbnail}
                                style={{ backgroundImage: `url(${selectedVideo.thumbnail})` }}
                            />
                        </div>
                        <div className={styles.rightSide}>
                            <p className={styles.videoName}>{selectedVideo.name}</p>
                            <div className={styles.bottomRow}>
                                <div className={styles.duration}>
                                    <Image src="/clockIcon.png" alt="Clock Icon" width={16} height={16} className={styles.logo} />
                                    <p>{selectedVideo.length}</p>
                                </div>
                                <button className={styles.metric}>Change Video</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                <div className={styles.placeholderThumbnail}>
                    <span style={{color: '#888', fontSize: '14px'}}>No Video Selected</span>
                </div>
                <button className={styles.metric2}  onClick={() => setIsModalOpen(true)}>Select Video</button>
                    </>
            )}

        </div>
    );
};

export default VideoSelector;
