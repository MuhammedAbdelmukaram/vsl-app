"use client";
import React, { useState } from "react";
import styles from "./upload.module.css";
import Image from "next/image";

const StepOne = ({
                     uploadStatus,
                     uploadedVideoUrl,
                     uploadedThumbnailUrl,
                     uploadedExitThumbnailUrl,
                     handleVideoFileChange,
                     handleThumbnailUploadWrapper,
                     nextStep,
                 }) => {
    const [loading, setLoading] = useState({
        video: false,
        thumbnail: false,
        exitThumbnail: false,
    });

    const handleUploadWithLoading = async (e, type) => {
        setLoading((prev) => ({ ...prev, [type]: true }));
        await handleThumbnailUploadWrapper(e, type);
        setLoading((prev) => ({ ...prev, [type]: false }));
    };

    return (
        <div className={styles.stepContainer}>
            <p className={styles.title}>Upload Your VSL</p>
            <div className={styles.uploadSection}>
                {/* Video Upload */}
                <div className={styles.uploadItem}>
                    <p className={styles.uploadDescription}>Upload Video</p>
                    <div
                        className={styles.uploadBox}
                        onClick={() => !loading.video && document.getElementById("fileInput").click()}
                    >
                        <input
                            type="file"
                            id="fileInput"
                            accept="video/*"
                            style={{ display: "none" }}
                            onChange={async (e) => {
                                setLoading((prev) => ({ ...prev, video: true }));
                                await handleVideoFileChange(e);
                                setLoading((prev) => ({ ...prev, video: false }));
                            }}
                        />
                        {loading.video ? (
                            <div className={styles.loader}></div>
                        ) : uploadedVideoUrl ? (
                            <div className={styles.uploadedContainer}>
                                <p>
                                    Video Uploaded{" "}
                                    <span style={{ fontWeight: "bold", color: "#97f38d" }}>
                                        Successfully
                                    </span>
                                </p>
                                <button
                                    className={styles.replaceButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        document.getElementById("fileInput").click();
                                    }}
                                >
                                    Replace
                                </button>
                            </div>
                        ) : (
                            <>
                                <Image src="/videos.png" alt="Upload Video" width={40} height={40} />
                                <div className={styles.dragDropArea}>
                                    <p style={{ fontSize: 18 }}>Upload Your Video</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Thumbnail Upload */}
                <div className={`${styles.uploadItem} ${!uploadedVideoUrl && styles.disabled}`}>
                    <p className={styles.uploadDescription}>Upload Thumbnail</p>
                    <div
                        className={`${styles.uploadBox} ${!uploadedVideoUrl && styles.disabledBox}`}
                        onClick={() =>
                            uploadedVideoUrl && !loading.thumbnail && document.getElementById("thumbnailInput").click()
                        }
                    >
                        <span className={styles.tooltip}>Upload video first</span>
                        <input
                            type="file"
                            id="thumbnailInput"
                            accept="image/*"
                            style={{ display: "none" }}
                            disabled={!uploadedVideoUrl}
                            onChange={(e) => handleUploadWithLoading(e, "thumbnail")}
                        />
                        {loading.thumbnail ? (
                            <div className={styles.loader}></div>
                        ) : uploadedThumbnailUrl ? (
                            <div className={styles.uploadedContainer}>
                                <p>
                                    Thumbnail Uploaded{" "}
                                    <span style={{ fontWeight: "bold", color: "#97f38d" }}>
                                        Successfully
                                    </span>
                                </p>
                                <button
                                    className={styles.replaceButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        document.getElementById("thumbnailInput").click();
                                    }}
                                >
                                    Replace
                                </button>
                            </div>
                        ) : (
                            <>
                                <Image src="/thumbnaiIcon.png" alt="Upload Thumbnail" width={40} height={40} />
                                <p>Upload Thumbnail</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Exit Thumbnail Upload */}
                <div className={`${styles.uploadItem} ${!uploadedVideoUrl && styles.disabled}`}>
                    <p className={styles.uploadDescription}>Upload Exit Thumbnail</p>
                    <div
                        className={`${styles.uploadBox} ${!uploadedVideoUrl && styles.disabledBox}`}
                        onClick={() =>
                            uploadedVideoUrl &&
                            !loading.exitThumbnail &&
                            document.getElementById("exitThumbnailInput").click()
                        }
                    >
                        <span className={styles.tooltip}>Upload video first</span>
                        <input
                            type="file"
                            id="exitThumbnailInput"
                            accept="image/*"
                            style={{ display: "none" }}
                            disabled={!uploadedVideoUrl}
                            onChange={(e) => handleUploadWithLoading(e, "exitThumbnail")}
                        />
                        {loading.exitThumbnail ? (
                            <div className={styles.loader}></div>
                        ) : uploadedExitThumbnailUrl ? (
                            <div className={styles.uploadedContainer}>
                                <p>
                                    Exit Thumbnail Uploaded{" "}
                                    <span style={{ fontWeight: "bold", color: "#97f38d" }}>
                                        Successfully
                                    </span>
                                </p>
                                <button
                                    className={styles.replaceButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        document.getElementById("exitThumbnailInput").click();
                                    }}
                                >
                                    Replace
                                </button>
                            </div>
                        ) : (
                            <>
                                <Image src="/exitThumbnail.png" alt="Upload Exit Thumbnail" width={40} height={40} />
                                <p>Upload Exit Thumbnail</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <button className={styles.nextButton} onClick={nextStep} disabled={!uploadedVideoUrl}>
                Next Step
            </button>
        </div>
    );
};

export default StepOne;
