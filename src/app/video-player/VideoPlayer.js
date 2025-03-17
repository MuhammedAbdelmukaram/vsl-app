"use client";

import React, {useState, useRef, useEffect} from "react";
import ProgressBar from "./ProgressBar";
import Overlay from "./Overlay";
import ExitThumbnail from "./ExitThumbnail";
import {adjustedExponentialProgress} from "./utils";
import * as styles from "./VideoPlayer.module.css";
import CustomPlayer from "./CustomPlayer";


const VideoPlayer = ({
                         videoId,
                         url,
                         autoPlay,
                         autoPlayText = "Click to Watch",
                         thumbnail,
                         exitThumbnail,
                         fastProgressBar,
                         showThumbnail,
                         showExitThumbnail,
                         width = "100%",
                         maxWidth = "800px",
                         aspectRatio = "16 / 9",
                         brandColor = "#ffffff",
                         border = false,
                         borderWidth = "1px",
                         borderRadius = "0px",
                         borderColor = "#ffffff",
                         theatreView = false,
                         fullScreen = false,
                         exitThumbnailButtons = true,
                         borderGlow,
                         borderGlowColor,
                     }) => {
    const localStorageKey = `video-progress-${videoId}`;
    const playerRef = useRef(null);
    const wrapperRef = useRef(null);
    const clickTimeoutRef = useRef(null);
    const isDoubleClickRef = useRef(false);
    const menuRef = useRef(null);

    const [playing, setPlaying] = useState(autoPlay);
    const [muted, setMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showOverlay, setShowOverlay] = useState(autoPlay || showThumbnail);
    const [showExit, setShowExit] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isTheatre, setIsTheatre] = useState(false);

    // ✅ Custom Context Menu State
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    const [lastWatchPosition, setLastWatchPosition] = useState(0);
    const [loading, setLoading] = useState(true); // Track loading state

// When the player starts, mark loading as false


    const [viewLogged, setViewLogged] = useState(false);


    // ✅ Hide context menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (contextMenuVisible && menuRef.current && !menuRef.current.contains(e.target)) {
                setContextMenuVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [contextMenuVisible]);

    // ✅ Show Context Menu on Right-Click
    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenuVisible(true);

        // Adjust menu position to prevent overflow
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const menuWidth = 160;
        const menuHeight = 40;

        const x = Math.min(e.clientX, viewportWidth - menuWidth);
        const y = Math.min(e.clientY, viewportHeight - menuHeight);

        setContextMenuPosition({ x, y });
    };

    // ✅ Clicking on "Powered by VSL Player" redirects
    const handleMenuClick = () => {
        window.open("https://vslplayer.io", "_blank");
        setContextMenuVisible(false);
    };


    const handleVideoLoaded = () => {
        setLoading(false);
    };


    useEffect(() => {
        if (autoPlay) {
            setShowOverlay(true);
        } else if (showThumbnail && thumbnail) {
            setShowOverlay(true);
        } else {
            setShowOverlay(false);
        }

        // ✅ Load last watch position from localStorage
        const savedPosition = localStorage.getItem(localStorageKey);
        if (savedPosition) {
            setLastWatchPosition(parseFloat(savedPosition));
        }
    }, [autoPlay, showThumbnail, thumbnail, videoId]);


    const handleProgress = (state) => {
        const progressValue = adjustedExponentialProgress(state.played, fastProgressBar);
        setProgress(progressValue);

        // ✅ Save progress to localStorage
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            localStorage.setItem(localStorageKey, currentTime);
        }
    };


    const handleStartOver = () => {
        setPlaying(true);
        setShowExit(false);  // ✅ Hide exit thumbnail & buttons when restarting
        if (playerRef.current) playerRef.current.seekTo(0);
    };

    const handleContinue = () => {
        setPlaying(true);
        setShowExit(false);  // ✅ Hide exit thumbnail & buttons when continuing
        if (playerRef.current) playerRef.current.seekTo(lastWatchPosition);
    };

    const handleOverlayClick = (e) => {
        if (e) e.stopPropagation();
        setShowOverlay(false);
        setMuted(false);
        setPlaying(true);
        setShowExit(false);  // ✅ Hide exit thumbnail & buttons when video starts
        if (playerRef.current) playerRef.current.seekTo(0);
    };

    const handlePause = () => {
        // ✅ Ensure `showExit` is always set to true when paused
        setShowExit(true);
        setPlaying(false);

        // ✅ Save the last watched position when paused
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            localStorage.setItem(localStorageKey, currentTime);
        }
    };



    useEffect(() => {
        console.log("playerRef in production:", playerRef.current);
    }, [playerRef.current]);


    const handleExitThumbnailClick = (e) => {
        if (e) e.stopPropagation();
        setShowExit(false);
        setPlaying(true);
    };

    /** 📌 Handle Seek (Move 5s forward/backward) */
    const handleSeek = (direction) => {
        if (!playerRef.current || typeof playerRef.current.seekTo !== "function") {
            console.warn("seekTo() is not available in production", playerRef.current);
            return;
        }

        const currentTime = playerRef.current.getCurrentTime ? playerRef.current.getCurrentTime() : 0;
        const duration = playerRef.current.getDuration ? playerRef.current.getDuration() : 0;

        if (direction === "backward") {
            playerRef.current.seekTo(Math.max(0, currentTime - 5), "seconds");
        } else if (direction === "forward") {
            playerRef.current.seekTo(Math.min(duration, currentTime + 5), "seconds");
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

    /** 📌 Log View for Tracking */
    const logView = async () => {
        if (!viewLogged && videoId) {
            try {
                const response = await fetch("/api/analytics/view", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({videoId}),
                });

                if (response.ok) {
                    setViewLogged(true);
                }
            } catch (error) {
                console.error("Error logging view:", error);
            }
        }
    };

    return (
        <div
            ref={wrapperRef}
            onContextMenu={handleContextMenu}
            className={`${styles.playerWrapper} ${isFullscreen ? styles.fullscreen : ""} 
        ${isTheatre ? styles.theatre : ""} 
        ${borderGlow ? styles.glowingBorder : ""}`}
            style={{
                width: isFullscreen ? "100vw" : isTheatre ? "1200px" : width,
                maxWidth: isFullscreen ? "100vw" : isTheatre ? "1200px" : maxWidth,
                aspectRatio,
                position: "relative",
                borderRadius,
                border: border ? `${borderWidth} solid ${borderColor}` : "none",
                "--borderGlowColor": borderGlow ? borderGlowColor : "transparent",
            }}
        >
            {/* 🎬 Show Skeleton Loader While Video is Loading */}
            {loading && (
                <div className={styles.skeletonLoader}>
                    <div className={styles.skeletonShimmer}></div>
                </div>
            )}

            {/* 🎥 Show Actual Video Player Only When Ready */}
            <div style={{ display: loading ? "none" : "block" }}>
                <CustomPlayer
                    ref={playerRef}

                    url={url}
                    playing={playing}
                    muted={muted}
                    onProgress={handleProgress}
                    onPause={handlePause}
                    onReady={() => setLoading(false)} // ✅ Mark as loaded when ready
                    onStart={() => {
                        setLoading(false); // ✅ Ensure loading disappears when video starts
                        if (!viewLogged && videoId) {
                            fetch("/api/analytics/view", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ videoId }),
                            }).then((res) => {
                                if (res.ok) setViewLogged(true);
                            }).catch((error) => console.error("Error logging view:", error));
                        }
                    }}
                    progressInterval={fastProgressBar ? 25 : 50}
                />
            </div>


            {showOverlay && (
                <Overlay
                    thumbnail={thumbnail}
                    showThumbnail={!autoPlay && showThumbnail}
                    autoPlayText={autoPlayText}
                    handleClick={handleOverlayClick}
                />
            )}

            {/* ✅ ExitThumbnail always loads, but internal visibility logic is handled inside */}

            <ExitThumbnail
                exitThumbnail={exitThumbnail}
                handleClick={handleExitThumbnailClick}
                exitThumbnailButtons={exitThumbnailButtons}
                lastWatchPosition={lastWatchPosition}
                showExit={showExit}
                showExitThumbnail={showExitThumbnail} // ✅ Pass this to control visibility inside ExitThumbnail
                handleStartOver={handleStartOver}
                handleContinue={handleContinue}
            />

            {/* Custom Context Menu */}
            {contextMenuVisible && (
                <ul
                    ref={menuRef}
                    className={styles.contextMenu}
                    style={{
                        top: `${contextMenuPosition.y}px`,
                        left: `${contextMenuPosition.x}px`,
                    }}
                >
                    <li onClick={handleMenuClick}>Powered by VSL Player</li>
                </ul>
            )}


            <ProgressBar progress={progress} brandColor={brandColor}/>

            {/* 📌 Fullscreen Button */}
            {fullScreen && (
                <button className={styles.fullscreenButton} onClick={(e) => {
                    e.stopPropagation();
                    handleFullScreen();
                }}>
                    ⛶
                </button>
            )}

            {/* 📌 Theatre Mode Button */}
            {theatreView && (
                <button className={styles.theatreButton} onClick={(e) => {
                    e.stopPropagation();
                    handleTheatreMode();
                }}>
                    🖥
                </button>
            )}


            {/* Left Side Click for Backward */}
            <div onClick={(e) => handleClick(e, "backward")} className={styles.leftClickArea}></div>

            {/* Center Area for Play/Pause */}
            <div onClick={(e) => handleClick(e, "pause")} className={styles.centerClickArea}></div>

            {/* Right Side Click for Forward */}
            <div onClick={(e) => handleClick(e, "forward")} className={styles.rightClickArea}></div>
        </div>
    );
};

export default VideoPlayer;
