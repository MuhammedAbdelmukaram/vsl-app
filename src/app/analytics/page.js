"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/LayoutHS";
import VideoSelector from "./VideoSelector";
import VideoStats from "./VideoStats";
import ChartSection from "./ChartSection";
import StatisticsSection from "./StatisticsSection";
import VideoModal from "./VideoModal";
import RetentionGraph from "@/app/components/RetentionGraph";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./analytics.module.css";
import Loader from "@/app/loader/page";
import WeeklyHeatmap from "@/app/analytics/WeeklyHeatmap";

const Page = () => {
    const [activeTab, setActiveTab] = useState("overall");
    const [activeFilter, setActiveFilter] = useState("Page Views");
    const [activeChart, setActiveChart] = useState("Bar Chart");
    const [hasVideos, setHasVideos] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const [selectedRange, setSelectedRange] = useState("This Month");
    const [customDates, setCustomDates] = useState(() => {
        const today = new Date();
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return { from: firstOfMonth, to: lastOfMonth }; // ✅ whole month
    });



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

    if (loading) return <Loader/>;

    return (
        <Layout>
            <div className={styles.container}>
                <VideoSelector selectedVideo={selectedVideo} setIsModalOpen={setIsModalOpen} />


                {/* Tabs Navigation */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabButton} ${activeTab === "overall" ? styles.active : ""}`}
                        onClick={() => setActiveTab("overall")}
                    >
                        Overall Statistics
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === "retention" ? styles.active : ""}`}
                        onClick={() => setActiveTab("retention")}
                    >
                        Retention Graph
                    </button>
                </div>

                {/* Animated Tab Content */}
                {/* Tab Content or Placeholder */}
                <div className={styles.tabContent}>
                    {selectedVideo ? (
                        <AnimatePresence mode="wait">
                            {activeTab === "overall" && (
                                <motion.div
                                    key="overall"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.1 }}
                                >
                                    <ChartSection
                                        selectedVideo={selectedVideo}
                                        activeChart={activeChart}
                                        setActiveChart={setActiveChart}
                                        activeFilter={activeFilter}
                                        setActiveFilter={setActiveFilter}
                                        selectedRange={selectedRange}
                                        setSelectedRange={setSelectedRange}
                                        customDates={customDates}
                                        setCustomDates={setCustomDates}
                                    />

                                    <VideoStats selectedVideo={selectedVideo} customDates={customDates} />

                                    <StatisticsSection selectedVideo={selectedVideo} customDates={customDates} />
                                </motion.div>
                            )}

                            {activeTab === "retention" && (
                                <motion.div
                                    key="retention"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.1 }}
                                >
                                    <RetentionGraph selectedVideo={selectedVideo} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    ) : (
                        <div className={styles.placeholder}>
                            <p className={styles.placeholderText}>No video selected</p>

                        </div>
                    )}
                </div>


                {/* Video Modal */}
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
