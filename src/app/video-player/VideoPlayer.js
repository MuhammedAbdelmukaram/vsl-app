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
                         videoId, // New prop for video ID
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
    const [viewLogged, setViewLogged] = useState(false); // Track if the view has been logged

    // Track progress
    const handleProgress = (state) => {
        setProgress(adjustedExponentialProgress(state.played));
    };

    // Log views (ensure it logs only once)
    const logView = async () => {
        if (!viewLogged && videoId) {
            console.log("Logging view for:", videoId);

            try {
                const response = await fetch("http://localhost:3000/api/analytics/view", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ videoId }),
                });

                const result = await response.json();
                console.log("View log response:", result);

                if (response.ok) {
                    setViewLogged(true);
                } else {
                    console.error("Failed to log view:", result);
                }
            } catch (error) {
                console.error("Error logging view:", error);
            }
        }
    };


    // Handle overlay click
    const handleOverlayClick = (e) => {
        e.stopPropagation();
        setShowOverlay(false);
        setMuted(false);
        setPlaying(true);
        if (playerRef.current) playerRef.current.seekTo(0);
        logView(); // Log the view when overlay is clicked
    };

    // Handle pause event
    const handlePause = () => {
        if (showExitThumbnail) setShowExit(true);
    };

    // Handle exit thumbnail click
    const handleExitThumbnailClick = () => {
        setShowExit(false);
        setPlaying(true);
    };

    // Handle wrapper click (play/pause)
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
                onStart={logView} // Log view when video starts
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
