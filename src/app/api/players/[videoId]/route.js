export async function GET(req, { params }) {
    const { videoId } = params;

    const script = `
    (function () {
        console.log("Initializing script for videoId: ${videoId}");
        const container = document.getElementById('vid_${videoId}');
        if (!container) {
            console.error('Container not found for videoId: ${videoId}');
            return;
        }

        // Function to wait for React, ReactDOM, and VideoPlayer to load
        const waitForDependencies = () => {
            if (window.React && window.ReactDOM && window.VideoPlayer) {
                console.log("React, ReactDOM, and VideoPlayer loaded.");
                loadPlayer();
            } else {
                console.log("Waiting for dependencies...");
                setTimeout(waitForDependencies, 100);
            }
        };

        // Function to load the video player
        const loadPlayer = () => {
            console.log("Loading player...");

            // Remove thumbnail and backdrop
            const thumbnail = document.getElementById('thumb_${videoId}');
            const backdrop = document.getElementById('backdrop_${videoId}');
            if (thumbnail) thumbnail.remove();
            if (backdrop) backdrop.remove();

            // Add a root div for ReactPlayer
            const root = document.createElement('div');
            container.appendChild(root);

            const props = {
                url: 'https://cdn.vslapp.pro/videos/${videoId}-VSL.mp4',
                videoId: '${videoId}',
                thumbnail: 'https://cdn.vslapp.pro/thumbnails/${videoId}-image_115.png',
                showThumbnail: true,
            };

            // Render the VideoPlayer component dynamically
            const React = window.React;
            const ReactDOM = window.ReactDOM;
            const VideoPlayer = window.VideoPlayer;

            try {
                ReactDOM.render(React.createElement(VideoPlayer, props), root);
                console.log("Player initialized.");
            } catch (error) {
                console.error("Error rendering VideoPlayer:", error);
            }
        };

        waitForDependencies();
    })();
    `;

    return new Response(script, {
        headers: { "Content-Type": "application/javascript" },
    });
}
