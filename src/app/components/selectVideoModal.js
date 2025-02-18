"use client";
import React, {useState, useEffect} from "react";
import styles from "../upload/upload.module.css";
import ColorPicker from "@/app/components/colorPicker";

const StepTwo = ({
                     videoId,
                     minutes,
                     seconds,
                     handleMinutesChange,
                     handleSecondsChange,
                     nextStep,
                     prevStep, // Back to the previous step
                     token,
                 }) => {
    const [formData, setFormData] = useState({
        fastProgressBar: false,
        autoPlay: false,
        laterCta: false,
        showThumbnail: false,
        showExitThumbnail: false,
        exitThumbnailButtons: false,
        pitchTime: `${minutes || 0}:${seconds || 0}`, // Default to 0:0 if empty
        ctaText: "",
        autoPlayText: "",
        brandColor: "#ffffff",
        border: false, // New
        borderWidth: "1px", // New
        borderRadius: "0px", // New
        borderColor: "#ffffff", // New
        theatreView: false, // New
        fullScreen: false, // New
    });

    // Sync pitchTime whenever minutes or seconds change
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            pitchTime: `${minutes || 0}:${seconds || 0}`,
        }));
    }, [minutes, seconds]);

    const handleCheckboxChange = (e) => {
        const {id, checked} = e.target;
        setFormData((prev) => ({...prev, [id]: checked}));
    };

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        setFormData((prev) => ({...prev, [id]: value}));
    };

    // Handle brandColor updates from ColorPicker
    const handleBrandColorChange = (newColor) => {
        setFormData((prev) => ({ ...prev, brandColor: newColor }));
    };

// Handle borderColor updates from ColorPicker
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
            // Step 1: Save Video Settings
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
                        exitThumbnailButtons: formData.exitThumbnailButtons, // New
                        border: formData.border, // New
                        borderWidth: formData.borderWidth, // New
                        borderRadius: formData.borderRadius, // New
                        borderColor: formData.borderColor, // New
                        theatreView: formData.theatreView, // New
                        fullScreen: formData.fullScreen, // New
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
        <div className={styles.stepContainer}>
            <h2 className={styles.title}>Enhance Your VSL</h2>

            {/* Pick Options */}
            <div className={styles.optionsSectionWrapper}>
                <p className={styles.heading}>Pick your options</p>
                <div className={styles.optionsSection}>
                    {[
                        {id: "fastProgressBar", label: "Fast Progress Bar", recommended: true},
                        {id: "autoPlay", label: "Auto-Play", recommended: false},
                        {id: "showThumbnail", label: "Show Thumbnail", recommended: false},
                        {id: "showExitThumbnail", label: "Show Exit Thumbnail", recommended: false},
                        {id: "theatreView", label: "Theatre Mode", recommended: false}, // New
                        {id: "fullScreen", label: "Full Screen", recommended: false}, // New
                        {id: "border", label: "Enable Border", recommended: false}, // New
                        {id: "exitThumbnailButtons", label: "Exit Thumbnail Buttons", recommended: false},
                    ].map((option) => (
                        <div className={styles.option} key={option.id}>
                            <div className={styles.checkboxWrapper}>
                                <input
                                    type="checkbox"
                                    id={option.id}
                                    checked={formData[option.id]}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                            <label htmlFor={option.id} className={styles.label}>
                                {option.label}
                                {option.recommended && <span>(recommended)</span>}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Pitch Time */}
            <div className={styles.timeInputs}>
                <h3 className={styles.heading}>Add Pitch Time</h3>
                <div className={styles.timeInputsInner}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="minutesInput" className={styles.inputLabel}>Minute</label>
                        <input
                            id="minutesInput"
                            type="number"
                            placeholder="Minute"
                            value={minutes}
                            onChange={handleMinutesChange}
                            min="0"
                            max="59"
                            className={styles.timeInput}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="secondsInput" className={styles.inputLabel}>Second</label>
                        <input
                            id="secondsInput"
                            type="number"
                            placeholder="Second"
                            value={seconds}
                            onChange={handleSecondsChange}
                            min="0"
                            max="59"
                            className={styles.timeInput}
                        />
                    </div>
                </div>
            </div>

            {/* Add Texts */}
            <div>
                <h3 className={styles.heading}>Add Texts</h3>
                <div className={styles.textInputs}>
                    <label htmlFor="ctaText" className={styles.inputLabel}>CTA Text</label>
                    <input
                        type="text"
                        id="ctaText"
                        placeholder="Get Your Stuff Now!"
                        value={formData.ctaText}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.textInputs}>
                    <label htmlFor="autoPlayText" className={styles.inputLabel}>Auto-Play Text</label>
                    <input
                        type="text"
                        id="autoPlayText"
                        placeholder="This video has already started. Click to Listen!"
                        value={formData.autoPlayText}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.textInputs}>
                    <label htmlFor="brandColor" className={styles.heading}>Add Your Brand Color</label>
                    <ColorPicker
                        color={formData.brandColor}
                        onChange={handleBrandColorChange}
                    />

                </div>
            </div>

            {/* Border Settings */}
            {formData.border && (
                <>
                    <div className={styles.inputGroup}>
                        <label>Border Width</label>
                        <div className={styles.borderWidthGroup}>
                            {["1px", "2px", "3px"].map((width) => (
                                <button
                                    key={width}
                                    className={`${styles.borderWidthButton} ${formData.borderWidth === width ? styles.activeButton : ""}`}
                                    onClick={() => {
                                        console.log("Selected Width:", width); // Debugging
                                        setFormData((prev) => ({ ...prev, borderWidth: width }));
                                    }}
                                >
                                    {width}
                                </button>
                            ))}
                        </div>
                    </div>


                    <div className={styles.sliderThing}>
                        <label>Border Radius</label>

                        <input
                            type="range"
                            min="0"
                            max="8"
                            step="1"
                            value={parseInt(formData.borderRadius) || 1}
                            onChange={handleBorderRadiusChange}
                        />

                    </div>

                    <div className={styles.textInputs}>
                        <label>Border Color</label>
                        <ColorPicker
                            color={formData.borderColor}
                            onChange={handleBorderColorChange}
                        />

                    </div>
                </>
            )}

            {/* Back and Next Buttons */}
            <div className={styles.buttonsContainer}>
                <button className={styles.backButton} onClick={prevStep}>Back</button>
                <button className={styles.nextButton} onClick={handleSaveAndNext}>Next Step</button>
            </div>
        </div>
    );
};

export default StepTwo;
