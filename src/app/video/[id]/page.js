"use client";
import React, {useState, useEffect} from "react";
import {useParams} from "next/navigation";
import Layout from "../../components/LayoutHS";
import ColorPicker from "@/app/components/colorPicker";
import styles from "./video.module.css";
import Loader from "@/app/loader/page";
import {handleThumbnailUpload} from "../../../lib/uploadHelpers";
import UntrackedVideoPlayer from "@/app/untracked-video-player/UntrackedVideoPlayer";
import Retention from "@/app/components/analytics/Retention";
import Countries from "@/app/components/analytics/Countries";
import Devices from "@/app/components/analytics/Devices";
import Browser from "@/app/components/analytics/Browser";
import TrafficSource from "@/app/components/analytics/TrafficSource";
import General from "@/app/components/analytics/General";


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
            setVideo((prev) => ({
                ...prev,
                options: {...prev.options, [name]: checked},
            }));
        } else {
            setVideo((prev) => ({...prev, [name]: value}));
        }
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


    // Save updates to the database
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/updateVideo/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(video),
            });

            if (!response.ok) throw new Error("Failed to update video");
            alert("Video updated successfully!");

            setInitialVideo(video); // Update the initial state after saving
        } catch (err) {
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
        General: <General/>,
        Retention: <Retention/>,
        Countries: <Countries/>,
        Devices: <Devices/>,
        Browser: <Browser/>,
        "Traffic Source": <TrafficSource/>,
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
                        <div style={{width: "fit-content"}}>
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
                                <UntrackedVideoPlayer
                                    url={video.videoUrl}
                                    autoPlay={video.options.autoPlay}
                                    autoPlayText={video.autoPlayText}
                                    brandColor={video.brandColor}
                                    thumbnail={video.thumbnail}
                                    showThumbnail={video.options.showThumbnail}
                                    exitThumbnail={video.exitThumbnail}
                                    showExitThumbnail={video.options.showExitThumbnail}
                                    fastProgressBar={video.options.fastProgressBar}
                                />

                            </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div className={styles.optionsSection}>
                        <h3>Options</h3>
                        <div className={styles.optionsGrid}>
                            {Object.entries(video.options).map(([key, value]) => {
                                const isDisabled =
                                    key === "showThumbnail" && uploadedThumbnailUrl === "/default-thumbnail.jpg";
                                return (
                                    <div
                                        key={key}
                                        className={`${styles.option} ${isDisabled ? styles.disabledOption : ""}`}
                                        {...(isDisabled && {"data-tooltip": "Upload thumbnail first"})}
                                    >
                                        <input
                                            type="checkbox"
                                            id={key}
                                            name={key}
                                            checked={value}
                                            onChange={handleChange}
                                            disabled={isDisabled} // Ensure the checkbox is disabled when necessary
                                        />
                                        <label htmlFor={key}>
                                            {key
                                                .replace(/([A-Z])/g, " $1")
                                                .replace(/^./, (str) => str.toUpperCase())}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                    <div className={styles.thumbnails}>
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
                    </div>


                </div>


                <EmbedModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    embedCode={video.iFrame || "No embed code available"}
                />

                {/* Middle Section */}
                <div className={styles.middleSection}>
                    <div className={styles.inputs}>
                        <div className={styles.inputGroup}>
                            <label>Pitch Time</label>
                            <input
                                type="text"
                                name="pitchTime"
                                value={video.pitchTime || ""}
                                onChange={handleChange}
                                placeholder="e.g., 12:45"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Auto-Play Text</label>
                            <input
                                type="text"
                                name="autoPlayText"
                                value={video.autoPlayText || ""}
                                onChange={handleChange}
                                placeholder="Auto-play overlay text"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Brand Color</label>
                            <ColorPicker
                                color={video.brandColor || "#ffffff"}
                                onChange={(color) =>
                                    setVideo((prev) => ({
                                        ...prev,
                                        brandColor: color,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>

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
