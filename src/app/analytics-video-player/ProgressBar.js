import React from "react";
import * as styles from "./VideoPlayer.module.css";

const ProgressBar = ({ progress, brandColor }) => (
    <div className={styles.progressBarWrapper}>
        <div
            className={styles.progressBar}
            style={{
                width: `${progress * 100}%`,
                backgroundColor: brandColor,
            }}
        ></div>
    </div>
);

export default ProgressBar;
