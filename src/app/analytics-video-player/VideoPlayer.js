"use client";

import React, {useState, useRef, useEffect, forwardRef} from "react";
import ProgressBar from "./ProgressBar";
import Overlay from "./Overlay";
import ExitThumbnail from "./ExitThumbnail";
import {adjustedExponentialProgress} from "./utils";
import * as styles from "./VideoPlayer.module.css";
import CustomPlayer from "./CustomPlayer";


const VideoPlayer = (
    {
        videoId,
        m3u8Url,
        accountId,
        live = false,
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
    },
    ref // ✅ This is how forwardRef gives you the external ref
) => {

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
    const [userInitiated, setUserInitiated] = useState(!autoPlay);


    const [lastWatchPosition, setLastWatchPosition] = useState(0);
    const [loading, setLoading] = useState(true); // Track loading state
    const [autoPlayedAndEnded, setAutoPlayedAndEnded] = useState(false);

    const USE_SESSION_TIMEOUT = false; // Toggle this to enable/disable 30min logic

// When the player starts, mark loading as false


    const [viewLogged, setViewLogged] = useState(false);

    let lastKnownTime = null;
    const lastKnownTimeRef = useRef(null);


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

    // ✅ Handle sessionId (with optional 30min timeout logic)
    const now = Date.now();
    const lastSessionTime = parseInt(localStorage.getItem("lastSessionTime")) || 0;
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes

    if (
        !localStorage.getItem("sessionId") ||
        (USE_SESSION_TIMEOUT && now - lastSessionTime > sessionTimeout)
    ) {
        localStorage.setItem("sessionId", crypto.randomUUID());
    }

    localStorage.setItem("lastSessionTime", now);


// optionally: persist device ID too
    if (!localStorage.getItem("deviceId")) {
        localStorage.setItem("deviceId", crypto.randomUUID());
    }



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
        sendAnalyticsEvent("restarted", {
            fromPosition: lastWatchPosition
        });

        setUserInitiated(true);
        setPlaying(true);
        setAutoPlayedAndEnded(false);
        setShowExit(false);
        if (playerRef.current) playerRef.current.seekTo(0);
        handlePlay();
    };

    const handleContinue = () => {
        sendAnalyticsEvent("continued", {
            fromPosition: lastWatchPosition
        });

        setUserInitiated(true);
        setPlaying(true);
        setAutoPlayedAndEnded(false);
        setShowExit(false);
        if (playerRef.current) playerRef.current.seekTo(lastWatchPosition);
        handlePlay();
    };


    const handleOverlayClick = (e) => {
        if (e) e.stopPropagation();

        // ✅ Treat overlay click as user interaction (even if autoplay was true)
        setUserInitiated(true);
        setShowOverlay(false);
        setMuted(false);
        setPlaying(true);
        setAutoPlayedAndEnded(false);
        setShowExit(false);


        // ✅ Manually trigger "played" event if not yet logged
        if (!viewLogged) {
            sendAnalyticsEvent("played");
            setViewLogged(true);
        }

        handlePlay(); // still do this to trigger any extra logic
    };

    useEffect(() => {
        if (ref && typeof ref === "object" && ref !== null) {
            ref.current = {
                seekTo: (timeInSeconds) => {
                    if (playerRef.current) {
                        playerRef.current.seekTo(timeInSeconds, "seconds");
                    }
                },
                handleOverlayClick: () => {
                    handleOverlayClick();
                }
            };
        }
    }, [ref, handleOverlayClick]);
    const handlePause = () => {
        if (!userInitiated) {
            setAutoPlayedAndEnded(true);
            return;
        }

        const lastTime = lastKnownTimeRef.current;

        // ✅ Send "timed" event with last known time
        if (playerRef.current && lastTime !== null) {
            sendAnalyticsEvent("timed", { time: Math.round(lastTime) });
            lastKnownTimeRef.current = null;
        }

        // ✅ Send "paused" event with current player time
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            sendAnalyticsEvent("paused", { time: Math.round(currentTime) });
            localStorage.setItem(localStorageKey, currentTime);
        }

        setShowExit(true);
        setPlaying(false);
    };



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

    const getUTMParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source'),
            utm_medium: urlParams.get('utm_medium'),
            utm_campaign: urlParams.get('utm_campaign'),
            referrer: document.referrer || null,
        };
    };

    /** 📌 Log function */
    const sendAnalyticsEvent = async (eventType, eventData = {}) => {
        const payload = {
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            event: eventType,
            accountId: accountId,
            sessionId: localStorage.getItem("sessionId") || crypto.randomUUID(),
            device: localStorage.getItem("deviceId") || navigator.userAgent,
            event_version: "1.0.0",
            media_id: videoId,
            media_type: "video",
            player_version: "1.0.0",
            product: "vslplayer",
            domain: window.location.hostname,
            path: window.location.pathname,
            uri: window.location.href,
            metadata: {
                traffic_origin_params: getUTMParams()
            },
            data: eventData,
        };

        // ✅ Log full payload always
        console.log(`[Analytics Event] ${eventType}`, payload);

        {/*
            if (!live) {
                return;
            }
        */}

        try {
            await fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } catch (error) {
            console.error(`Failed to send ${eventType} event:`, error);
        }
    };



    useEffect(() => {
        let intervalId;
        let lastSentAt = Date.now();

        if (playing && playerRef.current && userInitiated) {
            intervalId = setInterval(() => {
                if (!playerRef.current) return;

                const currentTime = playerRef.current.getCurrentTime();
                lastKnownTimeRef.current = currentTime;

                const now = Date.now();
                const elapsed = now - lastSentAt;

                if (elapsed >= 20000) {
                    sendAnalyticsEvent("timed", { time: Math.round(currentTime) });
                    lastSentAt = now;
                    lastKnownTimeRef.current = null;
                }
            }, 5000);
        }

        return () => clearInterval(intervalId);
    }, [playing, userInitiated]);


    const handleEnded = () => {
        if (!userInitiated) return;

        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();

            // ✅ Send "finished" analytics event
            sendAnalyticsEvent("finished", { time: Math.round(currentTime) });


            // ✅ Clear last watch position from localStorage
            localStorage.removeItem(localStorageKey);
        }

        setShowExit(true);
        setPlaying(false);
    };




    useEffect(() => {
        const sendPageView = async () => {
            await sendAnalyticsEvent("pageview");
        };
        sendPageView();
    }, []);



    const handlePlay = () => {
        setLoading(false);

        const lastTime = lastKnownTimeRef.current;
        if (playerRef.current && lastTime !== null) {
            sendAnalyticsEvent("timed", { time: Math.round(lastTime) });
            lastKnownTimeRef.current = null;
        }

        if (!viewLogged && userInitiated) {
            sendAnalyticsEvent("played");
            setViewLogged(true);
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
                    onStart={handlePlay}
                    onPlay={handlePlay}
                    onEnded={handleEnded}
                    url={live ? m3u8Url : url}
                    playing={playing}
                    muted={muted}
                    onProgress={handleProgress}
                    onPause={handlePause}
                    onReady={() => setLoading(false)} // ✅ Mark as loaded when ready

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

export default forwardRef(VideoPlayer);

