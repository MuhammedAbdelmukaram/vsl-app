"use client";

import React, { useEffect, useState } from "react";
import VideoPlayer from "../../video-player/VideoPlayer";

const EmbedPage = ({ params }) => {
    const [id, setId] = useState(null);
    const [videoData, setVideoData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        // Unwrap the params asynchronously
        async function unwrapParams() {
            try {
                const unwrappedParams = await params;
                setId(unwrappedParams?.id);
            } catch (err) {
                setError("Failed to load params.");
            }
        }
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!id) return;

        // Fetch the video data when ID is available
        async function fetchVideo() {
            try {
                const response = await fetch(`/api/videos/${id}`);
                if (!response.ok) throw new Error("Failed to fetch video data");

                const data = await response.json();
                setVideoData(data);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchVideo();
    }, [id]);

    if (error) return <div>Error: {error}</div>;
    if (!videoData) return <div>Loading...</div>;

    return (
        <div>
            <VideoPlayer
                url={videoData.url}
                videoId={id}
                thumbnail={videoData.thumbnail}
                showThumbnail
                showExitThumbnail
                exitThumbnail={videoData.exitThumbnail}
                autoPlayText="Click to Watch"
            />
        </div>
    );
};

export default EmbedPage;
