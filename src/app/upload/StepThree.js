"use client";
import React from "react";
import styles from "./upload.module.css";

const StepThree = ({ videoId }) => {
    const embedCode = `
<iframe 
    src="${process.env.NEXT_PUBLIC_BASE_URL}/embed/${videoId}" 
    style="border: none; width: 100%; height: 500px;" 
    allow="autoplay; fullscreen" 
    allowfullscreen>
</iframe>
`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(embedCode);
        alert("Embed code copied to clipboard!");
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
            <button className={styles.finishButton}>Finish</button>
        </div>
    );
};

export default StepThree;
