"use client";

import React, {useState, useRef, useEffect} from "react";
import dynamic from "next/dynamic";
import ProgressBar from "./ProgressBar";
import Overlay from "./Overlay";
import ExitThumbnail from "./ExitThumbnail";
import {adjustedExponentialProgress} from "./utils";
import styles from "./VideoPlayer.module.css";

const ReactPlayer = dynamic(() => import("react-player"), {ssr: false});

const VideoPlayer = ({
                         videoId,
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
    const menuRef = useRef(null);
    const [playing, setPlaying] = useState(true);
    const [muted, setMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showOverlay, setShowOverlay] = useState(true);
    const [showExit, setShowExit] = useState(false);
    const [viewLogged, setViewLogged] = useState(false);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0});

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                contextMenuVisible &&
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setContextMenuVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [contextMenuVisible]);

    const handleProgress = (state) => {
        setProgress(adjustedExponentialProgress(state.played));
    };

    const logView = async () => {
        if (!viewLogged && videoId) {
            try {
                const response = await fetch("http://localhost:3000/api/analytics/view", {
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

    const handleOverlayClick = (e) => {
        e.stopPropagation();
        setShowOverlay(false);
        setMuted(false);
        setPlaying(true);
        if (playerRef.current) playerRef.current.seekTo(0);
        logView();
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

    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenuVisible(true);

        // Calculate the position relative to the viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const menuWidth = 150; // Approximate width of your menu
        const menuHeight = 40; // Approximate height of your single menu item

        const x = Math.min(e.clientX, viewportWidth - menuWidth);
        const y = Math.min(e.clientY, viewportHeight - menuHeight);

        setContextMenuPosition({x, y});
    };

    const handleMenuClick = () => {
        window.open("https://vslapp.com", "_blank");
        setContextMenuVisible(false);
    };

    return (
        <body style={{backgroundColor:"transparent", display:"flex",justifyContent:"center"}}>
        <div
            className={styles.playerWrapper}
            style={{width, maxWidth, aspectRatio}}
            onClick={handleWrapperClick}
            onContextMenu={handleContextMenu} // Disable default menu
        >
            <ReactPlayer
                ref={playerRef}
                url={url}
                playing={playing}
                muted={muted}
                onProgress={handleProgress}
                onPause={handlePause}
                onStart={logView}
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
                <ExitThumbnail exitThumbnail={exitThumbnail} handleClick={handleExitThumbnailClick}/>
            )}

            <ProgressBar progress={progress} brandColor={brandColor}/>

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
                    <li onClick={handleMenuClick}>Powered by VSLapp</li>
                </ul>
            )}
        </div>
        </body>
    );
};

export default VideoPlayer;
