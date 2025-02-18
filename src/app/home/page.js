"use client";
import React, { useEffect, useState } from "react";
import UpperSection from "../components/home/upperSection";
import LowerSection from "../components/home/lowerSection";
import Layout from "../components/LayoutHS";
import styles from "@/app/videos/videos.module.css";
import Loader from "@/app/loader/page";
import NoVideos from "@/app/components/home/noVideos";
import IntegrationModal from "@/app/components/integrationsModal";


const Home = () => {
    const [videoPerformance, setVideoPerformance] = useState([]);
    const [hasVideos, setHasVideos] = useState(false);
    const [favoredIntegrations, setFavoredIntegrations] = useState([]); // Track user's integrations
    const [loading, setLoading] = useState(true);
    const [showIntegrationModal, setShowIntegrationModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("User is not authenticated");
                }

                const response = await fetch("/api/getVideosHome", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setVideoPerformance([]);
                        setHasVideos(false);
                        return;
                    }
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                const { videos, favoredIntegrations } = data;

                setHasVideos(videos.length > 0);

                setVideoPerformance(videos.map((video) => ({
                    id: video._id,
                    name: video.name,
                    thumbnail: video.thumbnail || "/default-thumbnail.jpg",
                    views: 0,
                    uniqueViews: 0,
                    playRate: "0%",
                    pitchRetention: "0%",
                    engagement: "0%",
                    buttonClicks: 0,
                })));

                // Check if favoredIntegrations exists, otherwise show modal
                if (!favoredIntegrations || favoredIntegrations.length === 0) {
                    setShowIntegrationModal(true);
                } else {
                    setFavoredIntegrations(favoredIntegrations);
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
                setVideoPerformance([]);
                setHasVideos(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSaveIntegrations = (selectedIntegrations) => {
        setFavoredIntegrations(selectedIntegrations);
        setShowIntegrationModal(false);

        // Save to backend
        fetch("/api/saveIntegrations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ integrations: selectedIntegrations }),
        }).catch((error) => console.error("Error saving integrations:", error));
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <Layout>
            {hasVideos ? (
                <>
                    <UpperSection data={[]} />
                    <LowerSection data={videoPerformance} />
                </>
            ) : (
                <NoVideos />
            )}

            {/* Show integration modal if no favored integrations */}
            <IntegrationModal
                isOpen={showIntegrationModal}
                onClose={() => setShowIntegrationModal(false)}
                onSave={handleSaveIntegrations}
            />
        </Layout>
    );
};

export default Home;
