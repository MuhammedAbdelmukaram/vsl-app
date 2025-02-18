import React from "react";
import styles from "./noVideos.module.css";

const NoVideos = () => {
    return (
        <div className={styles.noVideosContainer}>
            {/* Tutorial Section */}
            <p className={styles.started}>Lets Get Started</p>
            <div className={styles.tutorialBox}>
                <img src="/videoThumbnail.png" alt="Tutorial Thumbnail" className={styles.tutorialImage}/>
                <div className={styles.tutorialContent}>
                    <div>
                        <h2 className={styles.tutorialTitle}>Turn your VSL into a conversion machine</h2>
                        <p className={styles.tutorialDescription}>
                            Here, we will show you everything you need to know to get started. Learn how to add a VSL
                            player to your website, plus tips and tricks to boost conversions.
                        </p>
                    </div>

                    <button className={styles.watchTutorial}>Watch Tutorial</button>
                </div>
            </div>

            <div className={styles.divider}>

            </div>
            {/* Progress Bar */}
            <div>
                <div>
                    <p className={styles.setupGuideHeading}>Setup Guide</p>
                </div>

                <div className={styles.progressSection}>
                    <p className={styles.progressText}><strong>1</strong> of 3 tasks completed</p>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill}></div>
                    </div>
                </div>
            </div>

            {/* Setup Guide Section */}
            <div className={styles.setupGuide}>
                <div className={styles.cardSelected}>
                    <span className={styles.stepNumber}>1</span>
                    <img src="/onboarding1.png" alt="Upload VSL" className={styles.cardImage}/>
                    <h3>Upload Your VSL</h3>
                    <p>Upload your video and customize the player experience.</p>
                    <button className={styles.metric}>Upload Video</button>
                </div>

                <div className={styles.card}>
                    <span className={styles.stepNumber}>2</span>
                    <img src="/onboarding2.png" alt="Add to Website" className={styles.cardImage}/>
                    <h3>Add it to your website</h3>
                    <p>Takes less than a minute, works on any website.</p>
                    <button className={styles.metric} disabled={true}>Add VSL</button>
                </div>

                <div className={styles.card}>
                    <span className={styles.stepNumber}>3</span>
                    <img src="/onboarding3.png" alt="Track Metrics" className={styles.cardImage}/>
                    <h3>Track VSL Metrics</h3>
                    <p>Make sure you don’t miss anything.</p>
                    <button className={styles.metric} disabled={true}>View More</button>
                </div>
            </div>
        </div>
    );
};

export default NoVideos;
