import React from "react";
import PlayButton from "./PlayButton";
import styles from "./VideoPlayer.module.css";

const Overlay = ({ thumbnail, autoPlayText, handleClick }) => (
    <div className={styles.overlay} onClick={handleClick}>
        {thumbnail && (
            <img src={thumbnail} alt="Thumbnail" className={styles.thumbnailImage} />
        )}
        <div className={styles.overlayContent}>
            <div className={styles.overlayContainer}>
                <PlayButton />
                <p>{autoPlayText}</p>
            </div>
        </div>
    </div>
);

export default Overlay;
