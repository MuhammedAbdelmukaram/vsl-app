(function () {
    const videoId = document.currentScript.getAttribute("src").split("/")[4]; // Extract videoId from the script URL
    const container = document.getElementById(`vid_${videoId}`);

    // Dynamically load React and ReactDOM
    const loadReactDependencies = (callback) => {
        if (!window.React || !window.ReactDOM || !window.ReactDOM.createRoot) {
            const reactScript = document.createElement("script");
            reactScript.src = "https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js";
            reactScript.onload = () => {
                const reactDomScript = document.createElement("script");
                reactDomScript.src = "https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js";
                reactDomScript.onload = callback;
                document.head.appendChild(reactDomScript);
            };
            document.head.appendChild(reactScript);
        } else {
            callback();
        }
    };

    // Load VideoPlayer logic from localhost for testing
    const loadVideoPlayer = (callback) => {
        if (!window.VideoPlayer) {
            const videoPlayerScript = document.createElement("script");
            videoPlayerScript.src = "http://localhost:3000/js/VideoPlayer.js"; // Load from localhost for testing
            videoPlayerScript.onload = callback;
            document.head.appendChild(videoPlayerScript);
        } else {
            callback();
        }
    };

    // Render the video player
    const renderPlayer = (videoData) => {
        const root = ReactDOM.createRoot(container);
        root.render(
            React.createElement(VideoPlayer, {
                videoId,
                url: videoData.url,
                thumbnail: videoData.thumbnail,
                exitThumbnail: videoData.exitThumbnail,
                showThumbnail: false, // Disable thumbnail placeholder
                showExitThumbnail: true,
                autoPlayText: "Playing now...",
            })
        );
    };

    // Fetch video metadata
    const fetchVideoData = async () => {
        try {
            const response = await fetch(`https://cdn.vslapp.pro/api/videos/${videoId}`);
            if (!response.ok) throw new Error("Failed to fetch video data");
            const videoData = await response.json();
            loadReactDependencies(() =>
                loadVideoPlayer(() => renderPlayer(videoData))
            );
        } catch (err) {
            console.error("Error fetching video data:", err);
        }
    };

    // Directly fetch and render the video player on page load
    fetchVideoData();
})();
