"use client";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import styles from "./upload.module.css";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { uploadVideoToR2, handleThumbnailUpload } from "@/lib/uploadHelpers.mjs";

const UploadPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");
    const [showExitModal, setShowExitModal] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");
    const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");
    const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState("");
    const [uploadedExitThumbnailUrl, setUploadedExitThumbnailUrl] = useState("");
    const [videoId, setVideoId] = useState(null);
    const [token, setToken] = useState(null);

    const router = useRouter();

    const handleVideoFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Step 1: Store the current videoId before uploading the new video
                const previousVideoId = videoId;

                // Step 2: Upload the new video
                await uploadVideoToR2(file, setVideoId, setUploadedVideoUrl, setUploadStatus);

                // Step 3: Log the previousVideoId (after videoId might have been updated)
                console.log("Previous video ID:", previousVideoId);

                // Step 4: Move the old video to the deleted collection using the dynamic route
                if (previousVideoId) {
                    try {
                        const response = await fetch(`/api/moveToDeleted/${previousVideoId}`, {
                            method: "POST",
                        });

                        if (!response.ok) {
                            throw new Error("Failed to move old video to the deleted collection");
                        }

                        console.log("Old video moved to the deleted collection successfully");
                    } catch (error) {
                        console.error("Error moving old video to deleted collection:", error);
                    }
                }
            } catch (error) {
                console.error("Error uploading new video:", error);
                setUploadStatus("Upload Failed. Please try again.");
            }
        }
    };


    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleThumbnailUploadWrapper = (e, type) => {
        handleThumbnailUpload(e.target.files[0], type, videoId, setUploadedThumbnailUrl, setUploadedExitThumbnailUrl);
    };

    const handleExitClick = () => {
        setShowExitModal(true);
    };

    const confirmExit = () => {
        setShowExitModal(false);
        router.push("/home"); // Redirect to desired page on exit
    };

    const cancelExit = () => {
        setShowExitModal(false);
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);

    return (
        <div className={styles.pageContainer}>
            <button className={styles.exitButton} onClick={handleExitClick}>
                Exit
            </button>

            {/* Exit Confirmation Modal */}
            {showExitModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Are you sure you want to exit?</h3>
                        <p>All progress will be lost.</p>
                        <div className={styles.modalActions}>
                            <button className={styles.confirmButton} onClick={confirmExit}>
                                Yes, Exit
                            </button>
                            <button className={styles.cancelButton} onClick={cancelExit}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.stepper}>
                {[1, 2, 3].map((step) => (
                    <div
                        key={step}
                        className={`${styles.step} ${
                            currentStep >= step ? styles.activeStep : ""
                        }`}
                    >

                    </div>
                ))}
            </div>


            {currentStep === 1 && (
                <StepOne
                    uploadStatus={uploadStatus}
                    uploadedVideoUrl={uploadedVideoUrl}
                    uploadedThumbnailUrl={uploadedThumbnailUrl}
                    uploadedExitThumbnailUrl={uploadedExitThumbnailUrl}
                    handleVideoFileChange={handleVideoFileChange}
                    handleThumbnailUploadWrapper={handleThumbnailUploadWrapper}
                    nextStep={nextStep}
                />
            )}
            {currentStep === 2 && (
                <StepTwo
                    videoId={videoId}
                    videoUrl={uploadedVideoUrl}
                    token={token}
                    minutes={minutes}
                    seconds={seconds}
                    handleMinutesChange={(e) => setMinutes(e.target.value)}
                    handleSecondsChange={(e) => setSeconds(e.target.value)}
                    nextStep={nextStep}
                    prevStep={() => setCurrentStep((prev) => prev - 1)}
                />

            )}
            {currentStep === 3 && <StepThree  videoId={videoId}/>}
        </div>
    );
};

export default UploadPage;
