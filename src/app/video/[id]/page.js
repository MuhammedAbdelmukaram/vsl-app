"use client";
import React, {useState, useEffect} from "react";
import {useParams} from "next/navigation";
import Layout from "../../components/LayoutHS";
import ColorPicker from "@/app/components/colorPicker";
import styles from "./video.module.css";
import Loader from "@/app/loader/page";
import {handleThumbnailUpload} from "../../../lib/uploadHelpers.mjs";
import UntrackedVideoPlayer from "@/app/untracked-video-player/UntrackedVideoPlayer";
import Retention from "@/app/components/analytics/Retention";
import Countries from "@/app/components/analytics/Countries";
import Devices from "@/app/components/analytics/Devices";
import Browser from "@/app/components/analytics/Browser";
import TrafficSource from "@/app/components/analytics/TrafficSource";
import General from "./General";
import Design from "./Design";
import Start from "./Start";
import End from "./End";
import UntrackedVideoPlayerTest from "@/app/untracked-video-player/UntrackedVideoPlayerTest";
import VideoStats from "@/app/video/[id]/VideoStats";
import VideoPlayer from "@/app/video-player/VideoPlayer";


const EmbedModal = ({isOpen, onClose, embedCode}) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode)
            .then(() => {
                alert("Embed code copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3>Embed Code</h3>
                <textarea
                    readOnly
                    value={embedCode}
                    className={styles.embedCodeTextarea}
                    onClick={handleCopy} // Copy text on click
                />
                <p className={styles.copyTip}>Click to copy</p>
                <button onClick={onClose} className={styles.closeButton}>
                    Close
                </button>
            </div>
        </div>
    );
};

const VideoPage = () => {
    const {id} = useParams(); // Fetch video ID from URL
    const [video, setVideo] = useState(null);
    const [activeTab, setActiveTab] = useState("General");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState(null);
    const [uploadedExitThumbnailUrl, setUploadedExitThumbnailUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialVideo, setInitialVideo] = useState(null); // State to store the initial video state


    // Fetch video data dynamically
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`/api/getVideo/${id}`, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                if (!response.ok) throw new Error("Failed to fetch video");
                const data = await response.json();

                console.log(data);
                setVideo(data);
                setUploadedThumbnailUrl(data.thumbnail);
                setUploadedExitThumbnailUrl(data.exitThumbnail);
                setInitialVideo(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchVideo();
    }, [id]);

    // Handle input and checkbox changes

    const hasChanges = JSON.stringify(video) !== JSON.stringify(initialVideo);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        if (type === "checkbox") {
            setVideo((prev) => {
                let updatedOptions = {...prev.options, [name]: checked};

                // If border is enabled, ensure borderWidth is set to 1px
                if (name === "border" && checked && !prev.options.borderWidth) {
                    updatedOptions.borderWidth = "1px";
                }

                return {
                    ...prev,
                    options: updatedOptions,
                };
            });
        } else {
            setVideo((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleBorderRadiusChange = (e) => {
        const newRadius = `${e.target.value}px`;
        setVideo((prev) => ({
            ...prev,
            options: {
                ...prev.options,
                borderRadius: newRadius,
            },
        }));
    };

    const handleThumbnailChange = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadUrl = await handleThumbnailUpload(
            file,
            type,
            id,
            setUploadedThumbnailUrl,
            setUploadedExitThumbnailUrl
        );

        // Update the video object with the new thumbnail URL
        setVideo((prev) => ({
            ...prev,
            [type]: uploadUrl, // Update 'thumbnail' or 'exitThumbnail' dynamically
        }));
    };

    const toggleBorderWidth = () => {
        if (!video.options.border) return; // Prevent changing if border is disabled

        const widths = ["1px", "2px", "3px"];
        const currentIndex = widths.indexOf(video.options.borderWidth || "1px");
        const nextIndex = (currentIndex + 1) % widths.length;

        setVideo((prev) => ({
            ...prev,
            options: {...prev.options, borderWidth: widths[nextIndex]},
        }));
    };


    const setBorderWidth = (width) => {
        if (!video.options.border) return; // Prevent changing if border is disabled

        setVideo((prev) => ({
            ...prev,
            options: {
                ...prev.options,
                borderWidth: width || "1px", // Default to 1px if no value exists
            },
        }));
    };


    const handlePitchTimeChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
        if (value.length > 4) value = value.slice(-4); // Limit to 4 digits (MM:SS)

        // Ensure MM:SS format
        let minutes = value.length > 2 ? value.slice(0, -2) : "0";
        let seconds = value.slice(-2).padStart(2, "0");

        setVideo((prev) => ({
            ...prev,
            pitchTime: `${minutes}:${seconds}`,
        }));
    };


    // Save updates to the database
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token"); // Retrieve token on the client side
            if (!token) throw new Error("Token not found in localStorage.");

            // Save the updated video data
            const updateResponse = await fetch(`/api/updateVideo/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(video),
            });

            if (!updateResponse.ok) {
                const updateError = await updateResponse.text();
                throw new Error(updateError || "Failed to update video");
            }
            alert("Video updated successfully!");

            // Trigger the Webpack bundling and upload process via the new API route
            const bundleResponse = await fetch("/api/generate-bundle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({video, token}), // Pass token in the request body
            });

            const bundleData = await bundleResponse.json();
            if (!bundleResponse.ok) throw new Error(bundleData.error || "Failed to generate player bundle");

            console.log("Player bundle generated and uploaded:", bundleData.url);
            alert("Player bundle updated successfully!");

            setInitialVideo(video); // Update the initial state after saving
        } catch (err) {
            console.error("Error saving video:", err);
            alert("Error updating video: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };





    if (loading) return <Loader/>;
    if (error) return <div>Error: {error}</div>;
    if (!video) return <div>No video found</div>;

    // Tab Content
    const tabContent = {
        General: <General
            video={video}
            handlePitchTimeChange={handlePitchTimeChange}
            handleChange={handleChange}/>,
        Design: <Design video={video} handleChange={handleChange} handleBorderRadiusChange={handleBorderRadiusChange} setVideo={setVideo} setBorderWidth={setBorderWidth}/>,
        Start: <Start video={video} handleChange={handleChange} handleThumbnailChange={handleThumbnailChange}
                      uploadedThumbnailUrl={uploadedThumbnailUrl}/>,
        End: <End video={video} handleChange={handleChange} handleThumbnailChange={handleThumbnailChange}
                  uploadedExitThumbnailUrl={uploadedExitThumbnailUrl}/>,
    };

    return (
        <Layout title={`${video.name}`}>
            <div className={styles.pageContainer}>
                {/* Upper Section */}
                <div className={styles.upperSection}>
                    <div className={styles.utilityButtons}>
                        <button
                            className={styles.embedButton}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Embed Code
                        </button>
                        <button
                            className={`${styles.saveButton} ${!hasChanges ? styles.unactiveSave : ""}`}
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving} // Disable if no changes or during saving
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    </div>
                    <div className={styles.videoDetails}>
                        <div style={{width: "40vw"}}>
                            <div className={styles.videoInfo}>
                                <input
                                    type="text"
                                    name="name"
                                    value={video.name || ""}
                                    onChange={handleChange}
                                    className={styles.inputTitle}
                                />
                                <p>
                                    Uploaded on:{" "}
                                    {new Date(video.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className={styles.videoThumbnail}>
                                <VideoPlayer
                                    url={video.videoUrl}
                                    videoId={video._id}
                                    accountId={video.user}
                                    m3u8Url={video.m3u8Url}
                                    autoPlay={video.options.autoPlay}
                                    autoPlayText={video.autoPlayText}
                                    brandColor={video.brandColor}
                                    thumbnail={video.thumbnail}
                                    showThumbnail={video.options.showThumbnail}
                                    exitThumbnail={video.exitThumbnail}
                                    showExitThumbnail={video.options.showExitThumbnail}
                                    fastProgressBar={video.options.fastProgressBar}
                                    border={video.options.border} // Enable border
                                    borderWidth={video.options.borderWidth}
                                    borderRadius={video.options.borderRadius}
                                    borderColor={video.options.borderColor}
                                    theatreView={video.options.theatreView}
                                    fullScreen={video.options.fullScreen}
                                    exitThumbnailButtons={video.options.exitThumbnailButtons}
                                    borderGlow={video.options.borderGlow}
                                    borderGlowColor={video.options.borderGlowColor}
                                />

                            </div>
                        </div>


                    </div>

                    <div className={styles.rightSide}>
                        <VideoStats/>
                        <div className={styles.viewAnalytics}>
                            <button className={styles.analyticsButton}>
                                View Full Analytics
                            </button>
                        </div>
                    </div>



                    {/*<div className={styles.thumbnails}>
                        <div className={styles.thumbnailImages}>
                            <div className={styles.thumbnailWrapper}>
                                <p>Thumbnail</p>
                                <label htmlFor="thumbnail-upload">
                                    <img
                                        src={uploadedThumbnailUrl || "/default-thumbnail.jpg"}
                                        alt="Thumbnail"
                                        className={styles.thumbnailImage}
                                    />
                                </label>
                                <input
                                    type="file"
                                    id="thumbnail-upload"
                                    accept="image/*"
                                    style={{display: "none"}} // Hide the input
                                    onChange={(e) => handleThumbnailChange(e, "thumbnail")}
                                />
                            </div>
                            <div className={styles.thumbnailWrapper}>
                                <p>Exit Thumbnail</p>
                                <label htmlFor="exit-thumbnail-upload">
                                    <img
                                        src={uploadedExitThumbnailUrl || "/default-thumbnail.jpg"}
                                        alt="Exit Thumbnail"
                                        className={styles.thumbnailImage}
                                    />
                                </label>
                                <input
                                    type="file"
                                    id="exit-thumbnail-upload"
                                    accept="image/*"
                                    style={{display: "none"}} // Hide the input
                                    onChange={(e) => handleThumbnailChange(e, "exitThumbnail")}
                                />
                            </div>
                        </div>
                    </div>*/}


                </div>


                <EmbedModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    embedCode={video.iFrame || "No embed code available"}
                />


                {/* Bottom Section */}
                <div className={styles.bottomSection}>
                    <div className={styles.tabs}>
                        {Object.keys(tabContent).map((tab) => (
                            <button
                                key={tab}
                                className={`${styles.tabButton} ${
                                    activeTab === tab ? styles.activeTab : ""
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className={styles.tabContent}>
                        {tabContent[activeTab]}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default VideoPage;
