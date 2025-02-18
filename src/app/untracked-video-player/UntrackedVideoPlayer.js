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
                         border = false,  // ✅ Enables/disables border
                         borderWidth = "0px", // ✅ Border width
                         borderRadius = "0px", // ✅ Border radius
                         borderColor = "#ffffff", // ✅ Border color
                         fullScreen= false,
                         exitThumbnailButtons= false,
                         theatreView= false
                     }) => {
    const playerRef = useRef(null);
    const clickTimeoutRef = useRef(null);
    const isDoubleClickRef = useRef(false);

    const [playing, setPlaying] = useState(autoPlay);
    const [muted, setMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showOverlay, setShowOverlay] = useState(autoPlay || showThumbnail);
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
        if (e) e.stopPropagation();
        setShowOverlay(false);
        setMuted(false);
        setPlaying(true);
        if (playerRef.current) playerRef.current.seekTo(0);
    };

    const handlePause = () => {
        if (showExitThumbnail && exitThumbnail) {
            setShowExit(true);
            setPlaying(false);
        }
    };

    const handleExitThumbnailClick = (e) => {
        if (e?.stopPropagation) e.stopPropagation();
        setShowExit(false);
        setPlaying(true);
    };

    const handleSeek = (direction) => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            const duration = playerRef.current.getDuration();

            if (direction === "backward") {
                playerRef.current.seekTo(Math.max(0, currentTime - 5));
            } else if (direction === "forward") {
                playerRef.current.seekTo(Math.min(duration, currentTime + 5));
            }
        }
    };

    const handleClick = (e, direction) => {
        if (e) e.stopPropagation();

        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
        }

        if (isDoubleClickRef.current) {
            // Second click detected within the delay -> Double Click Action (Seek)
            isDoubleClickRef.current = false;
            handleSeek(direction);
        } else {
            // First click -> Wait for possible second click
            isDoubleClickRef.current = true;
            clickTimeoutRef.current = setTimeout(() => {
                if (isDoubleClickRef.current) {
                    // No second click detected -> Toggle Play/Pause
                    setPlaying((prev) => !prev);
                }
                isDoubleClickRef.current = false;
            }, 200);
        }
    };

    return (
        <div
            className={styles.playerWrapper}
            style={{
                width,
                maxWidth,
                aspectRatio,
                position: "relative",
                borderRadius: borderRadius,
                border: border ? `${borderWidth} solid ${borderColor}` : "none",
            }}
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

            {showExit && showExitThumbnail && exitThumbnail && (
                <ExitThumbnail
                    exitThumbnail={exitThumbnail}
                    handleClick={handleExitThumbnailClick}
                />
            )}

            <ProgressBar progress={progress} brandColor={brandColor} />

            {/* Left Side Click for Backward */}
            <div
                onClick={(e) => handleClick(e, "backward")}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "25%",
                    height: "100%",
                    background: "rgba(255, 0, 0, 0.0)", // Make transparent after debugging
                    cursor: "pointer",
                }}
            ></div>

            {/* Center Area for Play/Pause */}
            <div
                onClick={(e) => handleClick(e, "pause")}
                style={{
                    position: "absolute",
                    top: 0,
                    left: "25%",
                    width: "50%",
                    height: "100%",
                    background: "rgba(0, 255, 0, 0.0)", // Make transparent after debugging
                    cursor: "pointer",
                }}
            ></div>

            {/* Right Side Click for Forward */}
            <div
                onClick={(e) => handleClick(e, "forward")}
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "25%",
                    height: "100%",
                    background: "rgba(0, 0, 255, 0.0)", // Make transparent after debugging
                    cursor: "pointer",
                }}
            ></div>
        </div>
    );
};

export default VideoPlayer;
