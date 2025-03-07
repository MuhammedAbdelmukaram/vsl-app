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
                         maxWidth = "",
                         aspectRatio = "16 / 9",
                         brandColor = "#ffffff",
                         border = false,
                         borderWidth = "1px", // Default border width
                         borderRadius = "0px",
                         borderColor = "#ffffff",
                         theatreView = false,
                         fullScreen = false,
                         exitThumbnailButtons = false,
                         borderGlow,
                         borderGlowColor

                     }) => {
    const playerRef = useRef(null);
    const wrapperRef = useRef(null);
    const clickTimeoutRef = useRef(null);
    const isDoubleClickRef = useRef(false);

    const [playing, setPlaying] = useState(autoPlay);
    const [muted, setMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showOverlay, setShowOverlay] = useState(autoPlay || showThumbnail);
    const [showExit, setShowExit] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isTheatre, setIsTheatre] = useState(false);

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

    /** 📌 Handle Seek (Move 5s forward/backward) */
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

    /** 📌 Handle Click Events (Single Tap = Play/Pause, Double Tap = Seek) */
    const handleClick = (e, direction) => {
        if (e) e.stopPropagation();

        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
        }

        if (isDoubleClickRef.current) {
            isDoubleClickRef.current = false;
            handleSeek(direction);
        } else {
            isDoubleClickRef.current = true;
            clickTimeoutRef.current = setTimeout(() => {
                if (isDoubleClickRef.current) {
                    setPlaying((prev) => !prev);
                }
                isDoubleClickRef.current = false;
            }, 200);
        }
    };

    /** 📌 Handle Fullscreen Toggle */
    const handleFullScreen = () => {
        if (!document.fullscreenElement) {
            if (wrapperRef.current?.requestFullscreen) {
                wrapperRef.current.requestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    /** 📌 Handle Theatre Mode Toggle */
    const handleTheatreMode = () => {
        setIsTheatre((prev) => !prev);
    };

    return (
        <div
            ref={wrapperRef}
            className={`${styles.playerWrapper} ${isFullscreen ? styles.fullscreen : ""} 
                ${isTheatre ? styles.theatre : ""} 
                ${borderGlow ? styles.glowingBorder : ""}`}  // Apply glow if enabled
            style={{
                width: isFullscreen ? "100vw" : isTheatre ? "1200px" : width,
                maxWidth: isFullscreen ? "100vw" : isTheatre ? "1200px" : maxWidth,
                aspectRatio,
                position: "relative",
                borderRadius,
                border: border ? `${borderWidth} solid ${borderColor}` : "none",
                "--borderGlowColor": borderGlow ? borderGlowColor : "transparent", // Pass color as a CSS variable
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
                <ExitThumbnail exitThumbnail={exitThumbnail} handleClick={handleExitThumbnailClick} />
            )}

            <ProgressBar progress={progress} brandColor={brandColor} />

            {/* 📌 Fullscreen Button (Only if fullScreen is enabled) */}
            {fullScreen && (
                <button
                    className={styles.fullscreenButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFullScreen();
                    }}
                >
                    ⛶
                </button>
            )}

            {/* 📌 Theatre Mode Button (Only if theatreView is enabled) */}
            {theatreView && (
                <button
                    className={styles.theatreButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleTheatreMode();
                    }}
                >
                    🖥
                </button>
            )}


            {/* Left Side Click for Backward */}
            <div
                onClick={(e) => handleClick(e, "backward")}
                className={styles.leftClickArea}
            ></div>

            {/* Center Area for Play/Pause */}
            <div
                onClick={(e) => handleClick(e, "pause")}
                className={styles.centerClickArea}
            ></div>

            {/* Right Side Click for Forward */}
            <div
                onClick={(e) => handleClick(e, "forward")}
                className={styles.rightClickArea}
            ></div>
        </div>
    );
};

export default VideoPlayer;
