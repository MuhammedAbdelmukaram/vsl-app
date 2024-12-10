"use client";
import React, { useEffect, useState } from "react";
import UpperSection from "../components/home/upperSection";
import LowerSection from "../components/home/lowerSection";
import Layout from "../components/LayoutHS";

const Home = () => {
    const [videoPerformance, setVideoPerformance] = useState([]); // State for videos

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token = localStorage.getItem("token"); // Assuming JWT is in localStorage
                const response = await fetch("/api/getVideos", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch videos");
                }

                const videos = await response.json();

                // Transform video data for LowerSection
                const formattedVideos = videos.map((video) => ({
                    id: video._id,
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

    return (
        <Layout>
            <UpperSection data={overallPerformance} />
            <LowerSection data={videoPerformance} />
        </Layout>
    );
};

export default Home;
