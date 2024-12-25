import React from "react";
import PlayButton from "./PlayButton";
import styles from "./VideoPlayer.module.css";

const Overlay = ({ thumbnail, showThumbnail, autoPlayText, handleClick }) => (
    <div className={styles.overlay} onClick={handleClick}>
        {/* Show thumbnail if conditions are met */}
        {showThumbnail && thumbnail ? (
            <img src={thumbnail} alt="Thumbnail" className={styles.thumbnailImage} />
        ) : (
            /* Show overlay content only when thumbnail is not displayed */
            <div className={styles.overlayContent}>
                <div className={styles.overlayContainer}>
                    <PlayButton />
                    <p>{autoPlayText}</p>
                </div>
            </div>
        )}
    </div>
);

export default Overlay;
