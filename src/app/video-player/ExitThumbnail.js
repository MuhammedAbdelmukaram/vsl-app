import React from "react";
import styles from "./VideoPlayer.module.css";

const ExitThumbnail = ({ exitThumbnail, handleClick }) => (
    <div className={styles.exitThumbnail} onClick={handleClick}>
        <img src={exitThumbnail} alt="Exit Thumbnail" className={styles.thumbnailImage} />
    </div>
);

export default ExitThumbnail;
