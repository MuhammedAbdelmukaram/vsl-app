// components/CustomPlayer.js
"use client"; // Ensure it's a client component

import React from "react";
import ReactPlayer from "react-player/file";

const CustomPlayer = React.forwardRef(({ url, playing, muted, onProgress, onPause, onStart, progressInterval, onEnded }, ref) => {
    return (
        <ReactPlayer
            ref={ref} // ✅ Now refs will work correctly
            url={url}
            playing={playing}
            muted={muted}
            onEnded={onEnded}
            onProgress={onProgress}
            onPause={onPause}
            onStart={onStart}
            progressInterval={progressInterval}
            width="100%"
            height="100%"
            controls={false}
        />
    );
});

CustomPlayer.displayName = "CustomPlayer"; // Fix for React warnings

export default CustomPlayer;
