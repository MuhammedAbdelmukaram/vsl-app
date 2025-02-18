import React from "react";
import * as styles from "./VideoPlayer.module.css";

const PlayButton = () => (
    <button className={styles.playButton}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="#000000">
            <polygon points="5,3 19,12 5,21" />
        </svg>
    </button>
);

export default PlayButton;
