"use client";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import styles from "./upload.module.css";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { uploadVideoToR2, handleThumbnailUpload } from "@/lib/uploadHelpers";

const UploadPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");
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
            await uploadVideoToR2(file, setVideoId, setUploadedVideoUrl, setUploadStatus);
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

    const nextStep = () => setCurrentStep((prev) => prev + 1);

    return (
        <div className={styles.pageContainer}>
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
