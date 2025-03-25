import React from "react";
import ReactDOM from "react-dom/client";
import ReactPlayer from "react-player";
import VideoPlayer from "./app/video-player/VideoPlayer";

export { ReactPlayer };

// ✅ Ensure VIDEO_CONFIG is globally assigned
if (typeof VIDEO_CONFIG === "undefined") {
    console.error("❌ VIDEO_CONFIG is not defined at runtime. Ensure it's set before the script loads.");
} else {
    console.log("✅ VIDEO_CONFIG Loaded:", VIDEO_CONFIG);
}

// ✅ Assign VIDEO_CONFIG to a local variable so it's available everywhere
const videoConfig = typeof VIDEO_CONFIG !== "undefined" ? VIDEO_CONFIG : null;

// ✅ Extract videoId from `_id`, NOT `videoId`
const videoId = videoConfig ? videoConfig._id : null;

(function initializePlayers() {
    const videoConfig = typeof VIDEO_CONFIG !== "undefined" ? VIDEO_CONFIG : null;

    if (!videoConfig || !videoConfig._id) {
        console.error("❌ VIDEO_CONFIG is missing.");
        return;
    }

    const videoId = videoConfig._id;
    const containerId = `vid_${videoId}`;
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`❌ Video container with ID '${containerId}' not found.`);
        return;
    }

    if (!container.dataset.initialized) {
        container.dataset.initialized = "true";

        const root = ReactDOM.createRoot(container);
        root.render(
            <VideoPlayer
                videoId={videoId}
                m3u8Url={videoConfig.m3u8Url}
                url={videoConfig.videoUrl}
                fastProgressBar={videoConfig.options.fastProgressBar}
                autoPlayText={videoConfig.autoPlayText || "Click to Watch"}
                thumbnail={videoConfig.thumbnail}
                exitThumbnail={videoConfig.exitThumbnail}
                showThumbnail={videoConfig.options.showThumbnail}
                showExitThumbnail={videoConfig.options.showExitThumbnail}
                autoPlay={videoConfig.options.autoPlay}
                brandColor={videoConfig.brandColor}
                border={videoConfig.options.border} // Enable border
                borderWidth={videoConfig.options.borderWidth}
                borderRadius={videoConfig.options.borderRadius}
                borderColor={videoConfig.options.borderColor}
                theatreView={videoConfig.options.theatreView}
                fullScreen={videoConfig.options.fullScreen}
                exitThumbnailButtons={videoConfig.options.exitThumbnailButtons}
                borderGlow={videoConfig.options.borderGlow}
                borderGlowColor={videoConfig.options.borderGlowColor}
            />
        );

        console.log(`✅ VideoPlayer initialized inside #${containerId}`);
    }
})();

