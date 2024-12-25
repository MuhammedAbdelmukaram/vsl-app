import React from "react";
import styles from "./VideoPlayer.module.css";

const ExitThumbnail = ({ exitThumbnail, handleClick }) => {

    return (
        <div
            className={styles.exitThumbnailWrapper}
            onClick={(e) => {
                e.stopPropagation(); // Prevent triggering wrapper click
                handleClick();
            }}
        >
            <img
                src={exitThumbnail}
                alt="Exit Thumbnail"
                className={styles.exitThumbnailImage}
            />
        </div>
    );
};

export default ExitThumbnail;
