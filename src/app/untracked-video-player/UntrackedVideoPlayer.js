"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import ProgressBar from "./ProgressBar";
import Overlay from "./Overlay";
import ExitThumbnail from "./ExitThumbnail";
import { adjustedExponentialProgress } from "./utils";
import styles from "./VideoPlayer.module.css";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const VideoPlayer = ({
                         url,
                         autoPlayText = "Click to Watch",
                         thumbnail,
                         exitThumbnail,
                         showThumbnail = false,
                         showExitThumbnail = false,
                         width = "100%",
                         maxWidth = "800px",
                         aspectRatio = "16 / 9",
                         brandColor = "#ffffff",
                     }) => {
    const playerRef = useRef(null);

    const [playing, setPlaying] = useState(true);
    const [muted, setMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showOverlay, setShowOverlay] = useState(true);
    const [showExit, setShowExit] = useState(false);

    const handleProgress = (state) => {
        setProgress(adjustedExponentialProgress(state.played));
    };

    const handleOverlayClick = (e) => {
        e.stopPropagation();
        setShowOverlay(false);
        setMuted(false);
        setPlaying(true);
        if (playerRef.current) playerRef.current.seekTo(0);
    };

    const handlePause = () => {
        if (showExitThumbnail) setShowExit(true);
    };

    const handleExitThumbnailClick = () => {
        setShowExit(false);
        setPlaying(true);
    };

    const handleWrapperClick = () => {
        if (!showExit) setPlaying((prev) => !prev);
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
                progressInterval={50}
                width="100%"
                height="100%"
                className={styles.reactPlayer}
                controls={false}
            />

            {showOverlay && (
                <Overlay
                    thumbnail={showThumbnail ? thumbnail : null}
                    autoPlayText={autoPlayText}
                    handleClick={handleOverlayClick}
                />
            )}

            {showExit && exitThumbnail && (
                <ExitThumbnail exitThumbnail={exitThumbnail} handleClick={handleExitThumbnailClick} />
            )}

            <ProgressBar progress={progress} brandColor={brandColor} />
        </div>
    );
};

export default VideoPlayer;
