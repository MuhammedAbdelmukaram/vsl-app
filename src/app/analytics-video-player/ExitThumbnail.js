import React from "react";
import * as styles from "../untracked-video-player/VideoPlayer.module.css";

const ExitThumbnail = ({
                           exitThumbnail,
                           handleClick,
                           exitThumbnailButtons,
                           lastWatchPosition,
                           showExit,  // ✅ Controls whether this component is shown
                           showExitThumbnail,
                           handleStartOver,
                           handleContinue
                       }) => {
    if (!showExit) return null;  // ✅ If showExit is false, don't render anything

    console.log("➡️ buttons", exitThumbnailButtons);
    console.log("➡️ position:", lastWatchPosition);


    return (
        <div
            className={styles.exitThumbnailWrapper}
            onClick={(e) => {
                e.stopPropagation();
                handleClick();
            }}
        >
            {/* ✅ Show exit thumbnail image only if showExitThumbnail is true */}
            {showExitThumbnail && exitThumbnail && (
                <img
                    src={exitThumbnail}
                    alt="Exit Thumbnail"
                    className={styles.exitThumbnailImage}
                />
            )}

            {/* ✅ Exit buttons always appear if exitThumbnailButtons is true */}
            {exitThumbnailButtons && lastWatchPosition > 0 && (
                <div className={styles.exitButtonsContainer}>
                    <button className={styles.exitButton} onClick={handleStartOver}>
                        <img src={"/restart.svg"} alt="Restart" className={styles.buttonIcon} />
                        Start Over
                    </button>
                    <button className={styles.exitButton} onClick={handleContinue}>
                        <img src={"/play.svg"} alt="Continue" className={styles.buttonIcon} />
                        Continue
                    </button>
                </div>
            )}

        </div>
    );
};

export default ExitThumbnail;
