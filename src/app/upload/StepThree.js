"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./upload.module.css";

const StepThree = ({ videoId }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const embedCode = `
<iframe 
    src="${process.env.NEXT_PUBLIC_BASE_URL}/embed/${videoId}" 
    style="border: none; width: 100%; height: 500px;" 
    allow="autoplay; fullscreen" 
    allowfullscreen>
</iframe>
`;

    useEffect(() => {
        const saveEmbedCode = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token"); // JWT token

                const payload = {
                    videoId,
                    iFrame: embedCode, // Save the iFrame code
                };

                const response = await fetch("/api/putVideo", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) throw new Error("Failed to save embed code.");

                console.log("Embed code saved successfully!");
            } catch (error) {
                console.error("Error saving embed code:", error);
            } finally {
                setLoading(false);
            }
        };

        saveEmbedCode();
    }, [videoId]); // Run effect when videoId changes

    const copyToClipboard = () => {
        navigator.clipboard.writeText(embedCode);
        alert("Embed code copied to clipboard!");
    };

    const handleFinish = () => {
        router.push("/videos"); // Navigate to /videos
    };

    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.title}>Copy Your Embed Link</h2>
            <p className={styles.heading}>Embed Code</p>
            <div className={styles.embedSection}>
                <textarea
                    value={embedCode}
                    readOnly
                    className={styles.embedCode}
                />
                <button className={styles.copyButton} onClick={copyToClipboard}>
                    Copy Code
                </button>
            </div>
            <button
                className={styles.finishButton}
                onClick={handleFinish}
                disabled={loading}
            >
                {loading ? "Saving..." : "Finish"}
            </button>
        </div>
    );
};

export default StepThree;
