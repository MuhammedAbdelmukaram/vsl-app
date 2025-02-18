(async () => {
    const videoId = document.currentScript.getAttribute("src").split("/")[4];
    const container = document.getElementById(`vid_${videoId}`);
    if (!container) {
        console.error(`Container for video ID ${videoId} not found.`);
        return;
    }

    // Fetch video data
    const response = await fetch(`/api/videos/${videoId}`);
    if (!response.ok) {
        console.error("Failed to fetch video data");
        return;
    }

    const videoData = await response.json();

    // Dynamically load React and the player
    if (!window.React || !window.ReactDOM) {
        const reactScript = document.createElement("script");
        reactScript.src = "https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js";
        reactScript.onload = () => {
            const reactDomScript = document.createElement("script");
            reactDomScript.src = "https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js";
            reactDomScript.onload = () => initializePlayer(videoData, container);
            document.head.appendChild(reactDomScript);
        };
        document.head.appendChild(reactScript);
    } else {
        initializePlayer(videoData, container);
    }
})();

function initializePlayer(videoData, container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        React.createElement(VideoPlayer, {
            videoId: videoData.videoId,
            url: videoData.videoUrl,
            thumbnail: videoData.thumbnail,
            autoPlayText: videoData.autoPlayText,
            showThumbnail: videoData.options.showThumbnail,
        })
    );
}
