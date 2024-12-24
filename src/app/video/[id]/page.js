"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Layout from "../../components/LayoutHS";
import ColorPicker from "@/app/components/upload/colorPicker";
import styles from "./video.module.css";
import Loader from "@/app/loader/page";

const VideoPage = () => {
    const { id } = useParams(); // Fetch video ID from URL
    const [video, setVideo] = useState(null);
    const [activeTab, setActiveTab] = useState("General");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch video data dynamically
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`/api/getVideo/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch video");
                const data = await response.json();
                setVideo(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchVideo();
    }, [id]);

    // Handle input and checkbox changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setVideo((prev) => ({
                ...prev,
                options: { ...prev.options, [name]: checked },
            }));
        } else {
            setVideo((prev) => ({ ...prev, [name]: value }));
        }
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
        General: (
            <div className={styles.analyticsGrid}>
                {Array(6)
                    .fill()
                    .map((_, index) => (
                        <div className={styles.analyticsCard} key={index}>
                            <h4>Total Views</h4>
                            <p>435</p>
                            <div className={styles.chart}></div>
                        </div>
                    ))}
            </div>
        ),
        Retention: <div>Retention analytics coming soon...</div>,
        Countries: <div>Country-wise analytics coming soon...</div>,
        Devices: <div>Device-specific analytics coming soon...</div>,
        Browser: <div>Browser-specific analytics coming soon...</div>,
        "Traffic Source": <div>Traffic source analytics coming soon...</div>,
    };

    return (
        <Layout title={`${video.name}`}>
            <div className={styles.pageContainer}>
                {/* Upper Section */}
                <div className={styles.upperSection}>
                    <div className={styles.videoDetails}>
                        <div style={{ width: "fit-content" }}>
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
                                <video src={video.videoUrl} controls width="100%"></video>
                            </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div className={styles.optionsSection}>
                        <h3>Options</h3>
                        <div className={styles.optionsGrid}>
                            {Object.entries(video.options).map(([key, value]) => (
                                <div key={key} className={styles.option}>
                                    <input
                                        type="checkbox"
                                        id={key}
                                        name={key}
                                        checked={value}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor={key}>
                                        {key
                                            .replace(/([A-Z])/g, " $1")
                                            .replace(/^./, (str) =>
                                                str.toUpperCase()
                                            )}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className={styles.thumbnails}>
                        <div className={styles.thumbnailImages}>
                            <div className={styles.thumbnailWrapper}>
                                <p>Thumbnail</p>
                                <img
                                    src={video.thumbnail || "/default-thumbnail.jpg"}
                                    alt="Thumbnail"
                                />
                            </div>
                            <div className={styles.thumbnailWrapper}>
                                <p>Exit Thumbnail</p>
                                <img
                                    src={video.exitThumbnail || "/default-thumbnail.jpg"}
                                    alt="Exit Thumbnail"
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>

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
