"use client";
import React, {useState} from "react";
import {useRouter} from "next/navigation"; // Import useRouter
import styles from "./upload.module.css";
import Image from "next/image";
import ColorPicker from "@/app/components/upload/colorPicker";

const UploadPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");
    const router = useRouter(); // Initialize router

    const handleMinutesChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value) && value >= 0 && value <= 59) {
            setMinutes(value);
        } else if (value === "") {
            setMinutes("");
        }
    };

    const handleSecondsChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value) && value >= 0 && value <= 59) {
            setSeconds(value);
        } else if (value === "") {
            setSeconds("");
        }
    };

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const previousStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const exitUploadProcess = () => {
        router.push("/videos"); // Redirect to /videos
    };

    return (
        <div className={styles.pageContainer}>
            {/* Exit Button */}
            <button className={styles.exitButton} onClick={exitUploadProcess}>
                ← Exit
            </button>

            <div className={styles.stepper}>
                {[1, 2, 3].map((step) => (
                    <div
                        key={step}
                        className={`${styles.step} ${
                            step <= currentStep ? styles.activeStep : ""
                        }`}
                    />
                ))}
            </div>

            {currentStep === 1 && (
                <div className={styles.stepContainer}>
                    <p className={styles.title}>Upload Your VSL</p>
                    <div className={styles.uploadSection}>
                        <div className={styles.uploadItem}>
                            <p className={styles.uploadDescription}>
                                Upload Video
                            </p>
                            <div className={styles.uploadBox}>
                                <Image
                                    src="/videos.png"
                                    alt="Upload Video"
                                    className={styles.uploadIcon}
                                    width={40}
                                    height={40}
                                />
                                <div className={styles.dragDropArea}>
                                    <span>Drag and Drop Your Video</span>
                                    <div className={styles.orWord}>
                                        <div className={styles.greyLine}></div>
                                        <span>or</span>
                                        <div className={styles.greyLine}></div>
                                    </div>
                                    <button className={styles.browseButton}>Browse Files</button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.uploadItem}>
                            <p className={styles.uploadDescription}>
                                Upload Thumbnail
                            </p>
                            <div className={styles.uploadBox}>
                                <Image
                                    src="/thumbnaiIcon.png"
                                    alt="Upload Thumbnail"
                                    className={styles.uploadIcon}
                                    width={40}
                                    height={40}
                                />
                                <div className={styles.dragDropArea}>
                                    <span>Drag and Drop Your Thumbnail</span>
                                    <div className={styles.orWord}>
                                        <div className={styles.greyLine}></div>
                                        <span>or</span>
                                        <div className={styles.greyLine}></div>
                                    </div>

                                    <button className={styles.browseButton}>Browse Files</button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.uploadItem}>
                            <p className={styles.uploadDescription}>
                                Upload Exit Thumbnail
                            </p>
                            <div className={styles.uploadBox}>
                                <Image
                                    src="/exitThumbnail.png"
                                    alt="Upload Exit Thumbnail"
                                    className={styles.uploadIcon}
                                    width={40}
                                    height={40}
                                />
                                <div className={styles.dragDropArea}>
                                    <span>Drag and Drop Your Thumbnail</span>
                                    <div className={styles.orWord}>
                                        <div className={styles.greyLine}></div>
                                        <span>or</span>
                                        <div className={styles.greyLine}></div>
                                    </div>
                                    <button className={styles.browseButton}>Browse Files</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className={styles.nextButton} onClick={nextStep}>
                        Next Step
                    </button>
                </div>
            )}
            {currentStep === 2 && (
                <div className={styles.stepContainer}>
                    <h2 className={styles.title}>Enhance Your VSL</h2>
                    <div className={styles.optionsSectionWrapper}>
                        <p className={styles.heading}>Pick your options</p>
                        <div className={styles.optionsSection}>
                            <div className={styles.option}>
                                <div className={styles.checkboxWrapper}>
                                    <input type="checkbox" id="fastProgress"/>
                                </div>
                                <label htmlFor="fastProgress" className={styles.label}>
                                    Fast Progress Bar <span>(recommended)</span>
                                    <div className={styles.customInfoIcon}>i</div>
                                </label>
                            </div>
                            <div className={styles.option}>
                                <div className={styles.checkboxWrapper}>
                                    <input type="checkbox" id="autoPlay"/>
                                </div>
                                <label htmlFor="autoPlay" className={styles.label}>
                                    Auto-Play
                                    <div className={styles.customInfoIcon}>i</div>
                                </label>
                            </div>
                            <div className={styles.option}>
                                <div className={styles.checkboxWrapper}>
                                    <input type="checkbox" id="laterCta"/>
                                </div>
                                <label htmlFor="laterCta" className={styles.label}>
                                    Later CTA
                                    <div className={styles.customInfoIcon}>i</div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.timeInputs}>
                        <h3 className={styles.heading}>Add Pitch Time <div className={styles.customInfoIcon}>i</div>
                        </h3>
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
                    <div>

                        <h3 className={styles.heading}>Add Texts </h3>

                        <div style={{marginTop:30}}>

                        </div>

                        <div className={styles.textInputs}>
                            <label htmlFor="ctaText" className={styles.inputLabel}>CTA Text</label>
                            <input type="text" id="ctaText" placeholder="Get Your Stuff Now!"/>
                        </div>
                        <div className={styles.textInputs}>
                            <label htmlFor="autoPlayText" className={styles.inputLabel}>Auto-Play Text</label>
                            <input
                                type="text"
                                id="autoPlayText"
                                placeholder="This video has already started. Click to Listen!"
                            />
                        </div>
                        <div className={styles.textInputs}>
                            <label htmlFor="brandColor" className={styles.heading}>Add Your Brand Color</label>
                            <ColorPicker />
                        </div>
                    </div>

                    <button className={styles.nextButton} onClick={nextStep}>
                        Next Step
                    </button>
                </div>
            )}

            {currentStep === 3 && (
                <div className={styles.stepContainer}>
                    <h2 className={styles.title}>Copy Your Embed Link</h2>

                    <p className={styles.heading}>Embed Code</p>
                    <div className={styles.embedSection}>
                        <textarea
                            value={`<div style="position: relative; padding-bottom: 56.25%; height: 0;">
<iframe src="https://your-vsl-url" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
</div>`}
                            readOnly
                            className={styles.embedCode}
                        />
                        <button className={styles.copyButton}>Copy Code</button>
                    </div>
                    <button className={styles.finishButton}>Finish</button>
                    <p className={styles.helperText}>
                        I&apos;m not sure how to add this VSL to my website
                    </p>
                </div>
            )}
        </div>
    );
};

export default UploadPage;
