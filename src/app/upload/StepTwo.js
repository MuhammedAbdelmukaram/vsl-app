"use client";
import React, { useState, useEffect } from "react";
import styles from "./upload.module.css";
import ColorPicker from "@/app/components/colorPicker";
import VideoPlayer from "@/app/untracked-video-player/UntrackedVideoPlayerTest";

const StepTwo = ({
                     videoId,
                     videoUrl, // Ensure this is passed
                     thumbnail,
                     exitThumbnail,
                     minutes,
                     seconds,
                     handleMinutesChange,
                     handleSecondsChange,
                     nextStep,
                     prevStep,
                     token,
                 }) => {
    const [activeTab, setActiveTab] = useState("General");

    const [formData, setFormData] = useState({
        fastProgressBar: false,
        autoPlay: false,
        showThumbnail: false,
        showExitThumbnail: false,
        exitThumbnailButtons: false,
        pitchTime: `${minutes || 0}:${seconds || 0}`,
        autoPlayText: "",
        brandColor: "#ffffff",
        border: false,
        borderWidth: "1px",
        borderRadius: "0px",
        borderColor: "#ffffff",
        theatreView: false,
        fullScreen: false,
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            pitchTime: `${minutes || 0}:${seconds || 0}`,
        }));
    }, [minutes, seconds]);

    const handleCheckboxChange = (e) => {
        const { id, checked } = e.target;
        setFormData((prev) => ({ ...prev, [id]: checked }));
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleBrandColorChange = (newColor) => {
        setFormData((prev) => ({ ...prev, brandColor: newColor }));
    };

    const handleBorderColorChange = (newColor) => {
        setFormData((prev) => ({ ...prev, borderColor: newColor }));
    };

    const handleBorderRadiusChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            borderRadius: `${e.target.value}px`,
        }));
    };

    const handleSaveAndNext = async () => {
        try {
            const saveResponse = await fetch("/api/putVideo", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    videoId,
                    options: {
                        fastProgressBar: formData.fastProgressBar,
                        autoPlay: formData.autoPlay,
                        showThumbnail: formData.showThumbnail,
                        showExitThumbnail: formData.showExitThumbnail,
                        exitThumbnailButtons: formData.exitThumbnailButtons,
                        border: formData.border,
                        borderWidth: formData.borderWidth,
                        borderRadius: formData.borderRadius,
                        borderColor: formData.borderColor,
                        theatreView: formData.theatreView,
                        fullScreen: formData.fullScreen,
                    },
                    pitchTime: formData.pitchTime,
                    autoPlayText: formData.autoPlayText,
                    brandColor: formData.brandColor,
                }),
            });

            if (!saveResponse.ok) throw new Error("Failed to update video settings");
            console.log("Video settings updated successfully.");

            // Step 2: Fetch Updated Video Data
            const videoResponse = await fetch(`/api/getVideo/${videoId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!videoResponse.ok) throw new Error("Failed to fetch updated video");

            const updatedVideoData = await videoResponse.json();
            console.log("Fetched updated video data:", updatedVideoData);

            // Step 3: Trigger Webpack bundling and upload process
            const bundleResponse = await fetch("/api/generate-bundle-first", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ video: updatedVideoData, token }),
            });

            const bundleData = await bundleResponse.json();
            if (!bundleResponse.ok) throw new Error(bundleData.error || "Failed to generate player bundle");

            console.log("Player bundle generated and uploaded:", bundleData.url);

            // Step 4: Proceed to the next step
            nextStep();
        } catch (error) {
            console.error("Error updating settings or generating bundle:", error);
        }
    };

    return (
        <div className={styles.container}>


        <div className={styles.stepContainer}>
            <h2 className={styles.title}>Enhance Your VSL</h2>

            {/* Video Player */}
            <VideoPlayer
                url={videoUrl}
                autoPlay={formData.autoPlay}
                fastProgressBar={formData.fastProgressBar}
                showThumbnail={formData.showThumbnail}
                showExitThumbnail={formData.showExitThumbnail}
                thumbnail={thumbnail}
                exitThumbnail={exitThumbnail}
                autoPlayText={formData.autoPlayText}
                brandColor={formData.brandColor}
                border={formData.border}
                borderWidth={formData.borderWidth}
                borderRadius={formData.borderRadius}
                borderColor={formData.borderColor}
                theatreView={formData.theatreView}
                fullScreen={formData.fullScreen}
                exitThumbnailButtons={formData.exitThumbnailButtons}
            />

            {/* Tabs Navigation */}
            <div className={styles.tabNavigation}>
                {["General", "Design", "Start", "Exit"].map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>


        </div>



            {/* Tab Content */}
            <div className={styles.tabContent}>
                {activeTab === "General" && (
                    <>
                        <div className={styles.inputGroup}>
                            <label>Pitch Time</label>
                            <div className={styles.timeInputsInner}>
                                <input type="number" placeholder="Minute" value={minutes} onChange={handleMinutesChange} min="0" max="59" className={styles.timeInput} />
                                <input type="number" placeholder="Second" value={seconds} onChange={handleSecondsChange} min="0" max="59" className={styles.timeInput} />
                            </div>
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="fullScreen" checked={formData.fullScreen} onChange={handleCheckboxChange} />
                            <label htmlFor="fullScreen">Full Screen</label>
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="theatreView" checked={formData.theatreView} onChange={handleCheckboxChange} />
                            <label htmlFor="theatreView">Theatre View</label>
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="fastProgressBar" checked={formData.fastProgressBar} onChange={handleCheckboxChange} />
                            <label htmlFor="fastProgressBar">Fast Progress Bar</label>
                        </div>
                    </>
                )}

                {activeTab === "Design" && (
                    <>
                        <div className={styles.textInputs}>
                            <label>Progress Bar Color</label>
                            <ColorPicker color={formData.brandColor} onChange={handleBrandColorChange} />
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="border" checked={formData.border} onChange={handleCheckboxChange} />
                            <label htmlFor="border">Enable Border</label>
                        </div>
                        {formData.border && (
                            <>
                                <div className={styles.inputGroup}>
                                    <label>Border Width</label>
                                    <div className={styles.borderWidthGroup}>
                                        {["1px", "2px", "3px"].map((width) => (
                                            <button
                                                key={width}
                                                className={`${styles.borderWidthButton} ${formData.borderWidth === width ? styles.activeButton : ""}`}
                                                onClick={() => setFormData((prev) => ({ ...prev, borderWidth: width }))}
                                            >
                                                {width}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Border Radius</label>
                                    <input type="range" min="0" max="8" step="1" value={parseInt(formData.borderRadius) || 0} onChange={handleBorderRadiusChange} />
                                </div>
                                <div className={styles.textInputs}>
                                    <label>Border Color</label>
                                    <ColorPicker color={formData.borderColor} onChange={handleBorderColorChange} />
                                </div>
                            </>
                        )}
                    </>
                )}

                {activeTab === "Start" && (
                    <>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="autoPlay" checked={formData.autoPlay} onChange={handleCheckboxChange} />
                            <label htmlFor="autoPlay">Auto-Play</label>
                        </div>
                        <div className={styles.textInputs}>
                            <label>Auto-Play Text</label>
                            <input type="text" id="autoPlayText" value={formData.autoPlayText} onChange={handleInputChange} />
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="showThumbnail" checked={formData.showThumbnail} onChange={handleCheckboxChange} />
                            <label htmlFor="showThumbnail">Show Thumbnail</label>
                        </div>
                    </>
                )}

                {activeTab === "Exit" && (
                    <>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="showExitThumbnail" checked={formData.showExitThumbnail} onChange={handleCheckboxChange} />
                            <label htmlFor="showExitThumbnail">Show Exit Thumbnail</label>
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="exitThumbnailButtons" checked={formData.exitThumbnailButtons} onChange={handleCheckboxChange} />
                            <label htmlFor="exitThumbnailButtons">Show Exit Thumbnail Buttons</label>
                        </div>
                    </>
                )}
            </div>

            {/* Back and Next Buttons */}
            <div className={styles.buttonsContainer}>
                <button className={styles.backButton} onClick={prevStep}>Back</button>
                <button className={styles.nextButton} onClick={handleSaveAndNext}>Next Step</button>
            </div>
        </div>
    );
};

export default StepTwo;
