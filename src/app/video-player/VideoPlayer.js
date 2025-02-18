import React, { useState, useRef, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import Overlay from "./Overlay";
import ExitThumbnail from "./ExitThumbnail";
import { adjustedExponentialProgress } from "./utils";
import * as styles from "./VideoPlayer.module.css";
import FilePlayer from "react-player/file";


const VideoPlayer = ({
                         videoId,
                         url,
                         autoPlay ,
                         autoPlayText = "Click to Watch",
                         thumbnail,
                         exitThumbnail,
                         fastProgressBar,
                         showThumbnail,
                         showExitThumbnail,
                         width = "100%",
                         maxWidth = "800px",
                         aspectRatio = "",
                         brandColor = "#ffffff",
                     }) => {
    const playerRef = useRef(null);
    const menuRef = useRef(null);
    const [playing, setPlaying] = useState(autoPlay); // 🔥 Always start as false to prevent autoplay issues
    const [muted, setMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showOverlay, setShowOverlay] = useState(autoPlay || showThumbnail); // 🔥 Always start with the overlay visible
    const [showExit, setShowExit] = useState(false);

    const [viewLogged, setViewLogged] = useState(false);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (autoPlay) {
            setShowOverlay(true);
        } else if (showThumbnail && thumbnail) {
            setShowOverlay(true);
        } else {
            setShowOverlay(false);
        }
    }, [autoPlay, showThumbnail, thumbnail]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (contextMenuVisible && menuRef.current && !menuRef.current.contains(e.target)) {
                setContextMenuVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [contextMenuVisible]);

    const handleProgress = (state) => {
        const progressValue = adjustedExponentialProgress(state.played, fastProgressBar);
        setProgress(progressValue);
    };

    const logView = async () => {
        if (!viewLogged && videoId) {
            try {
                const response = await fetch("http://localhost:3000/api/analytics/view", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ videoId }),
                });

                if (response.ok) {
                    setViewLogged(true);
                }
            } catch (error) {
                console.error("Error logging view:", error);
            }
        }
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
            e.stopPropagation();
        }
        setShowExit(false);
        setPlaying(true); // Resume playback
    };

    const handleWrapperClick = (e) => {
        e.stopPropagation();
        if (showExit) {
            setShowExit(false);
            setPlaying(true);
        } else {
            setPlaying((prev) => !prev);
        }
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenuVisible(true);

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const menuWidth = 150;
        const menuHeight = 40;

        const x = Math.min(e.clientX, viewportWidth - menuWidth);
        const y = Math.min(e.clientY, viewportHeight - menuHeight);

        setContextMenuPosition({ x, y });
    };

    const handleMenuClick = () => {
        window.open("https://vslplayer.io", "_blank");
        setContextMenuVisible(false);
    };

    return (
        <div
            className={styles.playerWrapper}
            style={{ width, maxWidth, aspectRatio }}
            onClick={handleWrapperClick}
            onContextMenu={handleContextMenu}
        >
            <FilePlayer
                ref={playerRef}
                url={url}
                playing={playing}
                muted={muted}
                onProgress={handleProgress}
                onPause={handlePause}
                onStart={logView}
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


        </div>
    );
};

export default VideoPlayer;
