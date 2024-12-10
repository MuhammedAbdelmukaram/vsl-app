"use client";
import React, { useState, useEffect } from "react";
import styles from "./upload.module.css";
import ColorPicker from "@/app/components/upload/colorPicker";

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
        showThumbnail:false,
        showExitThumbnail:false,
        pitchTime: `${minutes || 0}:${seconds || 0}`, // Default to 0:0 if empty
        ctaText: "",
        autoPlayText: "",
        brandColor: "#ffffff",
    });

    // Sync pitchTime whenever minutes or seconds change
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

    const handleSaveAndNext = async () => {
        try {
            const response = await fetch("/api/putVideo", {
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
                    },
                    pitchTime: formData.pitchTime,
                    autoPlayText: formData.autoPlayText,
                    brandColor: formData.brandColor,
                }),
            });

            if (!response.ok) throw new Error("Failed to update video settings");

            const data = await response.json();
            console.log("Video updated successfully:", data);

            // Proceed to the next step after successful save
            nextStep();
        } catch (error) {
            console.error("Error updating settings:", error);
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
                        { id: "fastProgressBar", label: "Fast Progress Bar", recommended: true },
                        { id: "autoPlay", label: "Auto-Play", recommended: false },
                        { id: "showThumbnail", label: "Show Thumbnail", recommended: false },
                        { id: "showExitThumbnail", label: "Show Exit Thumbnail", recommended: false },
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
                        value={formData.brandColor}
                        onChange={(color) =>
                            setFormData((prev) => ({ ...prev, brandColor: color.hex }))
                        }
                    />
                </div>
            </div>

            {/* Back and Next Buttons */}
            <div className={styles.buttonsContainer}>
                <button className={styles.backButton} onClick={prevStep}>
                    Back
                </button>
                <button className={styles.nextButton} onClick={handleSaveAndNext}>
                    Next Step
                </button>
            </div>
        </div>
    );
};

export default StepTwo;
