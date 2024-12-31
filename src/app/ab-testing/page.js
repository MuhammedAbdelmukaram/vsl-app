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
                                <div className={styles.selectedVideo}>

                                    {selectedVideos[0] ? (

                                        <div style={{display:"flex", flexDirection:"row-reverse", width:"100%"}}>
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
                                                <div className={styles.pageName}>
                                                    <p>{selectedVideos[0].name}</p>
                                                </div>

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
                                                    <button
                                                        className={styles.editButton}
                                                        onClick={() => navigateToVideo(selectedVideos[0]._id)}
                                                    >
                                                        Edit Video 1
                                                    </button>
                                                </div>

                                                </div>
                                            </div>
                                            <div className={styles.pWrapper}>
                                                {selectedVideos[0] && (
                                                    <div className={styles.videoDetails}>
                                                        <p><strong>Fast Progress Bar:</strong> {selectedVideos[0].options.fastProgressBar ? 'Enabled' : 'Disabled'}</p>
                                                        <p><strong>Auto Play:</strong> {selectedVideos[0].options.autoPlay ? 'Enabled' : 'Disabled'}</p>
                                                        <p><strong>Show Thumbnail:</strong> {selectedVideos[0].options.showThumbnail ? 'Enabled' : 'Disabled'}</p>
                                                        <p><strong>Show Exit Thumbnail:</strong> {selectedVideos[0].options.showExitThumbnail ? 'Enabled' : 'Disabled'}</p>
                                                    </div>
                                                )}
                                            </div>


                                        </div>
                                    ) : (
                                        <button
                                            className={styles.metric}
                                            onClick={() => {
                                                setCurrentVideoIndex(0);
                                                setIsModalOpen(true);
                                            }}
                                        >

                                            Select Video 1

                                        </button>

                                    )}
                                </div>


                            {/* Selected Video 2 */}

                            <div className={styles.selectedVideo}>

                                {selectedVideos[1] ? (
                                    <div style={{display: "flex", flexDirection: "row-reverse", width:"100%"}}>
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
                                                <div className={styles.pageName}>
                                                    <p>{selectedVideos[1].name}</p>
                                                </div>
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
                                                    <button
                                                        className={styles.editButton}
                                                        onClick={() => navigateToVideo(selectedVideos[1]._id)}
                                                    >
                                                        Edit Video 2
                                                    </button>
                                                </div>
                                            </div>


                                        </div>
                                        <div className={styles.pWrapper}>
                                            {selectedVideos[1] && (
                                                <div className={styles.videoDetails}>
                                                    <p><strong>Fast Progress Bar:</strong> {selectedVideos[1].options.fastProgressBar ? 'Enabled' : 'Disabled'}</p>
                                                    <p><strong>Auto Play:</strong> {selectedVideos[1].options.autoPlay ? 'Enabled' : 'Disabled'}</p>
                                                    <p><strong>Show Thumbnail:</strong> {selectedVideos[1].options.showThumbnail ? 'Enabled' : 'Disabled'}</p>
                                                    <p><strong>Show Exit Thumbnail:</strong> {selectedVideos[1].options.showExitThumbnail ? 'Enabled' : 'Disabled'}</p>
                                                </div>
                                            )}
                                        </div>


                                    </div>
                                ) : (
                                    <button
                                        className={styles.metric}
                                        onClick={() => {
                                            setCurrentVideoIndex(1);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        Select Video 2
                                    </button>
                                )}
                            </div>
                        </div>

                        {selectedVideos[0] && selectedVideos[1] && (
                            <div className={styles.abTesting}>
                                <h2>Adjust Percentages</h2>
                                <div className={styles.sliders}>
                                    <div className={styles.sliderLabel}>
                                        {selectedVideos[0].name}: {percentages[0]}%
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={percentages[0]}
                                        onChange={(e) => handleSliderChange(Number(e.target.value))}
                                    />
                                    <div className={styles.sliderLabel}>
                                        {selectedVideos[1].name}: {percentages[1]}%
                                    </div>
                                </div>
                                <button
                                    className={styles.publishButton}
                                    onClick={handlePublish}
                                    disabled={!(selectedVideos[0] && selectedVideos[1])}
                                >
                                    Publish
                                </button>
                            </div>
                        )
                        }

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
