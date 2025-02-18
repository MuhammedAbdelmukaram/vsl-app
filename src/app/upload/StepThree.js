"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./upload.module.css";

const StepThree = ({ videoId }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [embedCode, setEmbedCode] = useState("");

    useEffect(() => {
        const fetchEmbedCode = async () => {
            try {
                const response = await fetch(`/api/getVideo/${videoId}`);
                if (!response.ok) throw new Error("Failed to fetch embed code.");

                const data = await response.json();
                if (data.playerEmbedCode) {
                    setEmbedCode(data.playerEmbedCode);
                } else {
                    throw new Error("Embed code not found.");
                }
            } catch (error) {
                console.error("Error fetching embed code:", error);
                setEmbedCode("Error: Unable to load embed code.");
            } finally {
                setLoading(false);
            }
        };

        if (videoId) {
            fetchEmbedCode();
        }
    }, [videoId]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(embedCode);
        alert("Embed code copied to clipboard!");
    };

    const handleFinish = () => {
        router.push("/videos"); // Navigate to the videos page
    };

    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.title}>Copy Your Embed Code</h2>
            <p className={styles.heading}>Embed Code</p>

            <div className={styles.embedSection}>
                {loading ? (
                    <p className={styles.loadingText}>Loading embed code...</p>
                ) : (
                    <>
                        <textarea
                            value={embedCode}
                            readOnly
                            className={styles.embedCode}
                        />
                        <button className={styles.copyButton} onClick={copyToClipboard}>
                            Copy Code
                        </button>
                    </>
                )}
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
