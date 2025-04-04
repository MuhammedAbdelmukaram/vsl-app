"use client";

import React, { useRef, useImperativeHandle } from "react";
import ReactPlayer from "react-player/file";

const CustomPlayer = React.forwardRef(({
                                           url,
                                           playing,
                                           muted,
                                           onProgress,
                                           onPause,
                                           onStart,
                                           progressInterval,
                                           onEnded
                                       }, ref) => {
    const internalPlayerRef = useRef(null);

    // ✅ Expose custom methods to parent via ref
    useImperativeHandle(ref, () => ({
        getCurrentTime: () => internalPlayerRef.current?.getCurrentTime?.() || 0,
        getDuration: () => internalPlayerRef.current?.getDuration?.() || 0,
        seekTo: (time, type) => internalPlayerRef.current?.seekTo?.(time, type),
        setPlaybackRate: (rate) => {
            const video = internalPlayerRef.current?.getInternalPlayer?.();
            if (video && video.playbackRate !== undefined) {
                video.playbackRate = rate;
            }
        }
    }));

    return (
        <ReactPlayer
            ref={internalPlayerRef}
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

CustomPlayer.displayName = "CustomPlayer";

export default CustomPlayer;
