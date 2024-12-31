"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation"; // For navigation
import Layout from "@/app/components/LayoutHS";
import Loader from "@/app/loader/page";
import styles from "./abtest.module.css";
import UntrackedVideoPlayer from "@/app/untracked-video-player/UntrackedVideoPlayer";

const Page = () => {
    const router = useRouter();
    const [content, setContent] = useState([]); // Fetched video data
    const [hasEnoughVideos, setHasEnoughVideos] = useState(false); // At least 2 videos
    const [loading, setLoading] = useState(true); // Loader state
    const [selectedVideos, setSelectedVideos] = useState([null, null]); // Selected videos
    const [percentages, setPercentages] = useState([50, 50]); // Percentages for the two videos
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const [currentVideoIndex, setCurrentVideoIndex] = useState(null); // Which video to select (1 or 2)

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("/api/getVideos", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setContent([]);
                        setHasEnoughVideos(false);
                        return;
                    }
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                if (data.length >= 2) {
                    setHasEnoughVideos(true);
                } else {
                    setHasEnoughVideos(false);
                }

                // Use the whole video object
                setContent(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching content:", error);
                setContent([]);
                setHasEnoughVideos(false);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    const handleVideoSelect = (video) => {
        if (currentVideoIndex !== null) {
            const updatedVideos = [...selectedVideos];
            updatedVideos[currentVideoIndex] = video;
            setSelectedVideos(updatedVideos);
            setIsModalOpen(false); // Close modal after selection
        }
    };

    const handleSliderChange = (value) => {
        setPercentages([value, 100 - value]);
    };

    const handlePublish = () => {
        alert(
            `Publishing A/B Test:
            Video 1: ${selectedVideos[0].name} (${percentages[0]}%)
            Video 2: ${selectedVideos[1].name} (${percentages[1]}%)`
        );
        // Here, you would send this data to your backend.
    };

    const navigateToVideo = (id) => {
        window.open(`/video/${id}`, '_blank'); // Opens the video page in a new tab
    };


    if (loading) return <Loader/>;

    return (
        <Layout>
            {hasEnoughVideos ? (
                    <div className={styles.pageContainer}>
                        <div className={styles.selectionSection}>


                            {/* Selected Video 1 */}
                            <div className={`${styles.selectedVideo} ${
                                selectedVideos[0] ? styles.selectedVideoActive : ""
                            }`}>
                                <div className={styles.pageName}>

                                    <p>{selectedVideos[0]?.name || "Select Video A"}</p>
                                    <div
                                        className={styles.discardVsl}
                                        onClick={() => {
                                            const updatedVideos = [...selectedVideos];
                                            updatedVideos[0] = null; // Discard the video at index 1
                                            setSelectedVideos(updatedVideos);
                                        }}
                                    >

                                    </div>
                                </div>
                                {selectedVideos[0] ? (

                                    <div style={{display: "flex", flexDirection: "row-reverse", width: "100%"}}>

                                        <div className={styles.videoStuff}>
                                            <div className={styles.selectedVideoCard}>
                                                <UntrackedVideoPlayer
                                                    url={selectedVideos[0].videoUrl}
                                                    autoPlay={selectedVideos[0].options.autoPlay}
                                                    autoPlayText={selectedVideos[0].autoPlayText}
                                                    brandColor={selectedVideos[0].brandColor}
                                                    thumbnail={selectedVideos[0].thumbnail}
                                                    showThumbnail={selectedVideos[0].options.showThumbnail}
                                                    exitThumbnail={selectedVideos[0].exitThumbnail}
                                                    showExitThumbnail={selectedVideos[0].options.showExitThumbnail}
                                                    fastProgressBar={selectedVideos[0].options.fastProgressBar}
                                                />


                                                <div className={styles.actionButtons}>
                                                    <button
                                                        className={styles.metric}
                                                        onClick={() => {
                                                            setCurrentVideoIndex(0);
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        Change Video 1
                                                    </button>

                                                </div>

                                            </div>
                                        </div>
                                        <div className={styles.pWrapper}>
                                            {selectedVideos[0] && (
                                                <div className={styles.videoDetails}>
                                                    <p>
                                                        <strong>Fast Progress Bar:</strong>
                                                        {selectedVideos[0].options.fastProgressBar ? (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="green"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="red"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                                                            </svg>
                                                        )}
                                                    </p>
                                                    <p>
                                                        <strong>Auto Play:</strong>
                                                        {selectedVideos[0].options.autoPlay ? (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="green"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="red"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                                                            </svg>
                                                        )}
                                                    </p>
                                                    <p>
                                                        <strong>Show Thumbnail:</strong>
                                                        {selectedVideos[0].options.showThumbnail ? (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="green"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="red"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                                                            </svg>
                                                        )}
                                                    </p>
                                                    <p>
                                                        <strong>Show Exit Thumbnail:</strong>
                                                        {selectedVideos[0].options.showExitThumbnail ? (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="green"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="red"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                                                            </svg>
                                                        )}
                                                    </p>
                                                    <div className={styles.editWrapper}>
                                                        <button
                                                            className={styles.editButton}
                                                            onClick={() => navigateToVideo(selectedVideos[0]._id)}
                                                        >
                                                            Edit video options
                                                        </button>
                                                    </div>

                                                </div>


                                            )}
                                        </div>


                                    </div>
                                ) : (
                                    <div style={{display: "flex", width: "100%", justifyContent: "space-between",}}>

                                        <p style={{color: "#9a9a9a", fontSize: 12}}>VIDEO A</p>

                                        <button
                                            className={styles.metric}
                                            onClick={() => {
                                                setCurrentVideoIndex(0);
                                                setIsModalOpen(true);
                                            }}
                                        >

                                            Select Video 1

                                        </button>
                                    </div>

                                )}
                            </div>


                            {/* Selected Video 2 */}

                            {/* Selected Video 2 */}
                            <div className={`${styles.selectedVideo} ${
                                selectedVideos[0] ? styles.selectedVideoActive2 : ""
                            }`}>
                                <div className={styles.pageName}>
                                    <p>{selectedVideos[1]?.name || "Select Video 2"}</p>
                                    <div
                                        className={styles.discardVsl}
                                        onClick={() => {
                                            const updatedVideos = [...selectedVideos];
                                            updatedVideos[1] = null; // Discard the video at index 1
                                            setSelectedVideos(updatedVideos);
                                        }}
                                    >

                                    </div>
                                </div>
                                {selectedVideos[1] ? (
                                    <div style={{display: "flex", flexDirection: "row-reverse", width: "100%"}}>
                                        <div className={styles.videoStuff}>
                                            <div className={styles.selectedVideoCard}>
                                                <UntrackedVideoPlayer
                                                    url={selectedVideos[1].videoUrl}
                                                    autoPlay={selectedVideos[1].options.autoPlay}
                                                    autoPlayText={selectedVideos[1].autoPlayText}
                                                    brandColor={selectedVideos[1].brandColor}
                                                    thumbnail={selectedVideos[1].thumbnail}
                                                    showThumbnail={selectedVideos[1].options.showThumbnail}
                                                    exitThumbnail={selectedVideos[1].exitThumbnail}
                                                    showExitThumbnail={selectedVideos[1].options.showExitThumbnail}
                                                    fastProgressBar={selectedVideos[1].options.fastProgressBar}
                                                />
                                                <div className={styles.actionButtons}>
                                                    <button
                                                        className={styles.metric}
                                                        onClick={() => {
                                                            setCurrentVideoIndex(1);
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        Change Video 2
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.pWrapper}>
                                            {selectedVideos[1] && (
                                                <div className={styles.videoDetails}>
                                                    <p>
                                                        <strong>Fast Progress Bar:</strong>
                                                        {selectedVideos[1].options.fastProgressBar ? (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="green"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="red"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                                                            </svg>
                                                        )}
                                                    </p>
                                                    <p>
                                                        <strong>Auto Play:</strong>
                                                        {selectedVideos[1].options.autoPlay ? (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="green"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="red"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                                                            </svg>
                                                        )}
                                                    </p>
                                                    <p>
                                                        <strong>Show Thumbnail:</strong>
                                                        {selectedVideos[1].options.showThumbnail ? (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="green"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="red"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                                                            </svg>
                                                        )}
                                                    </p>
                                                    <p>
                                                        <strong>Show Exit Thumbnail:</strong>
                                                        {selectedVideos[1].options.showExitThumbnail ? (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="green"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                className={styles.icon}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="red"
                                                                width="20"
                                                                height="20"
                                                            >
                                                                <path
                                                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                                                            </svg>
                                                        )}
                                                    </p>
                                                    <div className={styles.editWrapper}>
                                                        <button
                                                            className={styles.editButton}
                                                            onClick={() => navigateToVideo(selectedVideos[1]._id)}
                                                        >
                                                            Edit video options
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{display: "flex", width: "100%", justifyContent: "space-between"}}>
                                        <p style={{color: "#9a9a9a", fontSize: 12}}>VIDEO B</p>
                                        <button
                                            className={styles.metric}
                                            onClick={() => {
                                                setCurrentVideoIndex(1);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            Select Video 2
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>

                        {selectedVideos[0] && selectedVideos[1] && (
                            <div>
                                <div className={styles.abTesting}>
                                    <div className={styles.sliders}>
                                        <div className={styles.sliderContainer}>
                                            <p style={{ width: "100%", color: "#fffbf8", marginBottom: 16 }}>Split test at ratio:</p>
                                            <div className={styles.sliderValues}>
                                                <div className={styles.sliderLabelLeft}>
                            <span className={styles.percent}>
                                {percentages[0]}%
                            </span>
                                                </div>
                                                <span>:</span>
                                                <div className={styles.sliderLabelRight}>
                            <span className={styles.percent2}>
                                {percentages[1]}%
                            </span>
                                                </div>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={percentages[0]}
                                                className={styles.customSlider}
                                                onChange={(e) => handleSliderChange(Number(e.target.value))}
                                                style={{
                                                    background: `linear-gradient(to right, #ff6600 ${percentages[0]}%, #537e8f ${percentages[0]}%)`,
                                                }}
                                            />
                                            {/* Conditional text below the slider */}
                                            <p style={{ marginTop: "4px", textAlign: "center", color: "#b04f0d" }}>
                                                {percentages[0] === 50 ? "Recommended" : ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    <button
                                        className={styles.addButtonP}
                                        onClick={handlePublish}
                                        disabled={!(selectedVideos[0] && selectedVideos[1])}
                                    >
                                        Publish
                                    </button>
                                </div>
                            </div>
                        )}



                        {
                            isModalOpen && (
                                <div className={styles.modalOverlay}>
                                    <div className={styles.modal}>
                                        <h3>Select a Video</h3>
                                        <div className={styles.videoList}>
                                            {content.map((video) => (
                                                <div
                                                    key={video._id}
                                                    className={styles.modalVideoCard}
                                                    onClick={() => handleVideoSelect(video)}
                                                >
                                                    <img
                                                        src={video.thumbnail}
                                                        alt={video.name}
                                                        className={styles.modalThumbnail}
                                                    />
                                                    <p>{video.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            className={styles.closeModal}
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                ) :
                (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginLeft: 200,
                            marginTop: "28vh",
                        }}
                    >
                        <h2 style={{fontWeight: "normal", color: "#C2C2C2", marginBottom: 20}}>
                            You need to have at least 2 uploaded videos to start
                        </h2>
                        <button
                            className={styles.addButton}
                            onClick={() => {
                                window.location.href = "/upload";
                            }}
                        >
                            <img
                                src="/videos.png"
                                alt="Add New Video"
                                className={styles.buttonImage}
                            />
                            Upload Video
                        </button>
                    </div>
                )
            }
        </Layout>
    )
        ;
};

export default Page;
