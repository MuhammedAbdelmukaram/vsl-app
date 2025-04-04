import React from 'react';
import styles from "@/app/components/home/noVideos.module.css";

const TutorialBox = () => {
    return (
        <div className={styles.tutorialBoxWrapper}>
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
        </div>
    );
};

export default TutorialBox;