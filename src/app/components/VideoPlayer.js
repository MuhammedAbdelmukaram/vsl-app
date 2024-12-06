"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import styles from "./VideoPlayer.module.css";

// Dynamically import ReactPlayer to prevent SSR
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const VideoPlayer = ({ url, width = "100%", maxWidth = "800px", aspectRatio = "16 / 9" }) => {
    const playerRef = useRef(null);
    const wrapperRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    // Calculate exponential progress
    const exponentialProgress = (linearProgress) => {
        return Math.pow(linearProgress, 1 / 2); // Adjust exponent for desired effect
    };

    const handlePlayPause = () => {
        setPlaying((prev) => !prev);
    };

    const handleProgress = (state) => {
        const linearProgress = state.played; // Fraction of video played (0 to 1)
        setProgress(exponentialProgress(linearProgress));
    };

    const handleFullScreen = () => {
        if (wrapperRef.current) {
            if (!document.fullscreenElement) {
                wrapperRef.current.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    };

    return (
        <div
            className={styles.playerWrapper}
            ref={wrapperRef}
            style={{
                width: width,
                maxWidth: maxWidth,
                aspectRatio: aspectRatio,
            }}
            onClick={handlePlayPause} // Play/pause video on click
        >
            <ReactPlayer
                ref={playerRef}
                url={url}
                playing={playing}
                onProgress={handleProgress}
                progressInterval={50}
                width="100%"
                height="100%"
                className={styles.reactPlayer}
                controls={false}
            />
            <div className={styles.progressBarWrapper}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${progress * 100}%` }}
                ></div>
            </div>
            <button
                className={styles.playPauseButton}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating to the wrapper
                    handlePlayPause();
                }}
            >
                {playing ? "❚❚" : "▶"}
            </button>
            <button
                className={styles.fullscreenButton}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating to the wrapper
                    handleFullScreen();
                }}
            >
                ⛶
            </button>
        </div>
    );
};

export default VideoPlayer;
