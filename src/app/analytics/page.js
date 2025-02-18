"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/LayoutHS";
import VideoSelector from "./VideoSelector";
import VideoStats from "./VideoStats";
import ChartSection from "./ChartSection";
import StatisticsSection from "./StatisticsSection";
import VideoModal from "./VideoModal";
import RetentionGraph from "@/app/components/RetentionGraph";
import styles from "./analytics.module.css";

const Page = () => {
    const [activeFilter, setActiveFilter] = useState("Total Views");
    const [activeChart, setActiveChart] = useState("Bar Chart");
    const [hasVideos, setHasVideos] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("User is not authenticated");

                const response = await fetch("/api/getVideos", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setHasVideos(false);
                        return;
                    }
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                const videos = await response.json();
                setVideos(videos);
                setHasVideos(videos.length > 0);
            } catch (error) {
                console.error("Error fetching videos:", error);
                setHasVideos(false);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const handleVideoSelect = (video) => {
        setSelectedVideo(video);
        setIsModalOpen(false);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <Layout>
            <div className={styles.container}>
                <VideoSelector selectedVideo={selectedVideo} setIsModalOpen={setIsModalOpen} />
                <VideoStats selectedVideo={selectedVideo} />
                <ChartSection activeChart={activeChart} setActiveChart={setActiveChart} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                <StatisticsSection />
                <RetentionGraph />

                {isModalOpen && (
                    <VideoModal
                        videos={videos}
                        setSelectedVideo={handleVideoSelect}
                        setIsModalOpen={setIsModalOpen}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Page;
