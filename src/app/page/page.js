"use client";

import React, { useState } from "react";

const InsertVideoButton = () => {
    const [responseMessage, setResponseMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInsertVideo = async () => {
        setIsLoading(true);
        setResponseMessage("");

        try {
            const res = await fetch("/api/videoTest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: "67554f799c85ed4fd8c891e2", // Replace with a valid user ObjectId
                    videoUrl: "/test.mp4",
                    thumbnail: "/thumbnail.jpg",
                    exitThumbnail: "/exit-thumbnail.jpg",
                    options: {
                        fastProgressBar: true,
                        autoPlay: true,
                        showThumbnail: true,
                        showExitThumbnail: true,
                        exponentialProgress: true,
                    },
                    pitchTime: "02:45",
                    autoPlayText: "Click to Watch!",
                    brandColor: "#ff5733",
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to insert video");
            }

            const data = await res.json();
            setResponseMessage(`Success: ${data.message}`);
        } catch (error) {
            setResponseMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <button
                onClick={handleInsertVideo}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#0070f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
                disabled={isLoading}
            >
                {isLoading ? "Inserting..." : "Insert Test Video"}
            </button>
            {responseMessage && (
                <p style={{ marginTop: "10px", color: responseMessage.startsWith("Success") ? "green" : "red" }}>
                    {responseMessage}
                </p>
            )}
        </div>
    );
};

export default InsertVideoButton;
