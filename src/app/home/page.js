"use client";
import React, { useEffect, useState } from "react";
import UpperSection from "../components/home/upperSection";
import LowerSection from "../components/home/lowerSection";
import Layout from "../components/LayoutHS";
 // Assuming you have a Loader component
import styles from "@/app/videos/videos.module.css";
import Loader from "@/app/loader/page";

const Home = () => {
    const [videoPerformance, setVideoPerformance] = useState([]); // State for videos
    const [hasVideos, setHasVideos] = useState(false); // State to track if user has videos
    const [loading, setLoading] = useState(true); // State to show the loader

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token = localStorage.getItem("token"); // Assuming JWT is in localStorage

                if (!token) {
                    throw new Error("User is not authenticated");
                }

                const response = await fetch("/api/getVideos", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        // Handle the case where the user has no videos
                        setVideoPerformance([]);
                        setHasVideos(false);
                        return;
                    }
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                const videos = await response.json();

                if (videos.length > 0) {
                    setHasVideos(true);
                } else {
                    setHasVideos(false);
                }

                // Transform video data for LowerSection
                const formattedVideos = videos.map((video) => ({
                    id: video._id,
                    name:video.name,
                    thumbnail: video.thumbnail || "/default-thumbnail.jpg",
                    views: 0, // Placeholder: Replace with analytics data
                    uniqueViews: 0, // Placeholder
                    playRate: "0%",
                    pitchRetention: "0%",
                    engagement: "0%",
                    buttonClicks: 0,
                }));

                setVideoPerformance(formattedVideos);
            } catch (error) {
                console.error("Error fetching videos:", error);
                setVideoPerformance([]); // Ensure the state is set even in case of an error
                setHasVideos(false);
            } finally {
                setLoading(false); // Stop the loader once the API call is complete
            }
        };

        fetchVideos();
    }, []);

    const overallPerformance = [
        {
            label: "Total Views",
            value: "435",
            metric: "",
            trendData: [100, 200, 300, 400, 435],
        },
        {
            label: "CTA Clicks",
            value: "253",
            metric: "",
            trendData: [50, 150, 200, 250, 100],
        },
        {
            label: "Play Rate",
            value: "67.2",
            metric: "%",
            trendData: [20, 40, 60, 67, 67.2],
        },
        {
            label: "Average View Rate",
            value: "5.6",
            metric: "min",
            trendData: [1, 3, 4, 5.5, 5.6],
        },
        {
            label: "Pitch Retention",
            value: "47%",
            metric: "",
            trendData: [10, 30, 40, 46, 47],
        },
    ];

    if (loading) {
        // Show the loader while data is being fetched
        return <Loader />;
    }

    return (
        <Layout>
            {hasVideos ? (
                <>
                    <UpperSection data={overallPerformance} />
                    <LowerSection data={videoPerformance} />
                </>
            ) : (
                <div
                    style={{
                        textAlign: "center",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginLeft:200,
                        marginTop: "28vh",
                    }}
                >
                    <h2 style={{ fontWeight: "normal", color: "#C2C2C2", marginBottom: 20 }}>
                        Upload your first video
                    </h2>
                    <button
                        className={styles.addButton}
                        onClick={() => {
                            // Navigate to the upload page or open an upload modal
                            window.location.href = "/upload";
                        }}
                    >
                        <img
                            src="/videos.png"
                            alt="Add New Video"
                            className={styles.buttonImage}
                        />
                        Upload Video
                    </button>
                </div>
            )}
        </Layout>
    );
};

export default Home;
