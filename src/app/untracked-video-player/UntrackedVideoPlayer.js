"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import ProgressBar from "./ProgressBar";
import Overlay from "./Overlay";
import ExitThumbnail from "./ExitThumbnail";
import { adjustedExponentialProgress } from "./utils";
import styles from "./VideoPlayer.module.css";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const VideoPlayer = ({
                         url,
                         autoPlay,
                         fastProgressBar,
                         showThumbnail,
                         showExitThumbnail,
                         thumbnail,
                         exitThumbnail,
                         autoPlayText = "Click to Watch",
                         width = "100%",
                         maxWidth = "800px",
                         aspectRatio = "16 / 9",
                         brandColor = "#ffffff",
                     }) => {
    const playerRef = useRef(null);

    const [playing, setPlaying] = useState(autoPlay);
    const [muted, setMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showOverlay, setShowOverlay] = useState(autoPlay || showThumbnail); // Initial overlay
    const [showExit, setShowExit] = useState(false);

    useEffect(() => {
        if (autoPlay) {
            setShowOverlay(true);
        } else if (showThumbnail && thumbnail) {
            setShowOverlay(true);
        } else {
            setShowOverlay(false);
        }
    }, [autoPlay, showThumbnail, thumbnail]);

    const handleProgress = (state) => {
        const progressValue = adjustedExponentialProgress(state.played, fastProgressBar);
        setProgress(progressValue);
    };

    const handleOverlayClick = (e) => {
        e.stopPropagation();
        setShowOverlay(false);
        setMuted(false);
        setPlaying(true);
        if (playerRef.current) playerRef.current.seekTo(0);
    };

    const handlePause = () => {
        if (showExitThumbnail && exitThumbnail) {
            setShowExit(true);
            setPlaying(false); // Pause the video
        }
    };

    const handleExitThumbnailClick = (e) => {
        if (e) {
            e.stopPropagation(); // Prevent triggering wrapper click
        }
        setShowExit(false);
        setPlaying(true); // Resume playback when exit thumbnail is clicked
    };


    const handleWrapperClick = (e) => {
        e.stopPropagation(); // Prevent conflicts when clicking on ExitThumbnail
        if (showExit) {
            setShowExit(false);
            setPlaying(true);
        } else {
            setPlaying((prev) => !prev);
        }
    };

    return (
        <div
            className={styles.playerWrapper}
            style={{ width, maxWidth, aspectRatio }}
            onClick={handleWrapperClick}
        >
            <ReactPlayer
                ref={playerRef}
                url={url}
                playing={playing}
                muted={muted}
                onProgress={handleProgress}
                onPause={handlePause}
                progressInterval={fastProgressBar ? 25 : 50}
                width="100%"
                height="100%"
                className={styles.reactPlayer}
                controls={false}
            />

            {showOverlay && (
                <Overlay
                    thumbnail={thumbnail}
                    showThumbnail={!autoPlay && showThumbnail}
                    autoPlayText={autoPlayText}
                    handleClick={handleOverlayClick}
                />
            )}

            {/* Display exit thumbnail when conditions are met */}
            {showExit && showExitThumbnail && exitThumbnail && (
                <ExitThumbnail
                    exitThumbnail={exitThumbnail}
                    handleClick={handleExitThumbnailClick}
                />
            )}

            <ProgressBar progress={progress} brandColor={brandColor} />
        </div>
    );
};

export default VideoPlayer;
