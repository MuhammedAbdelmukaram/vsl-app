"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";  // ✅ Import Image for Next.js optimization
import styles from "./upload.module.css";

const StepThree = ({videoId}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("embed");
    const [embedCode, setEmbedCode] = useState("");
    const [speedCode, setSpeedCode] = useState("");
    const [favoredIntegrations, setFavoredIntegrations] = useState([]);

    // Mapping for integration icons
    const integrationIcons = {
        "framer": "/integrationIcons/FramerIcon.png",
        "clickfunnels": "/integrationIcons/ClickFunnelsIcon.png",
        "webflow": "/integrationIcons/WebflowIcon.png",
        "wordpress": "/integrationIcons/WordPressIcon.png",
        "shopify": "/integrationIcons/ShopifyIcon.png",
        "squarespace": "/integrationIcons/SquareSpaceIcon.png",
        "wix": "/integrationIcons/WixIcon.png",
        "woocommerce": "/integrationIcons/WoCommerceIcon.png",
        "react": "/integrationIcons/ReactIcon.png",
        "gohighlevel": "/integrationIcons/GoHighLevelIcon.png",
        "slack": "/integrationIcons/SlackIcon.png",
        "zapier": "/integrationIcons/ZapierIcon.png"
    };

    useEffect(() => {
        const fetchEmbedCode = async () => {
            try {
                const response = await fetch(`/api/getVideo/${videoId}`);
                if (!response.ok) throw new Error("Failed to fetch video data.");
                const data = await response.json();
                const {playerUrl, thumbnail, m3u8Url} = data;

                if (!playerUrl) throw new Error("Player URL not found.");
                const isValidUrl = (url) => url && url.startsWith("http");

                // ✅ Embed Code
                const embedHtml = `
<div
  id="vid_${videoId}"
  style="position: relative; width: 100%; display: flex; align-items: center; justify-content: center;"
></div>
<script
  id="scr_video_player_${videoId}"
  src="${playerUrl}"
  async
></script>
`.trim();


                // ✅ Speed Optimization Code
                const speedHtml = `
                <!-- Preload Assets -->
                <link rel="preload" href="${playerUrl}" as="script">
                ${isValidUrl(thumbnail) ? `<link rel="preload" href="${thumbnail}" as="image">` : ""}
                ${isValidUrl(m3u8Url) ? `<link rel="preload" href="${m3u8Url}" as="fetch">` : ""}

                <!-- DNS Prefetch for Faster Loading -->
                <link rel="dns-prefetch" href="${new URL(playerUrl).origin}">
                ${isValidUrl(thumbnail) ? `<link rel="dns-prefetch" href="${new URL(thumbnail).origin}">` : ""}
                ${isValidUrl(m3u8Url) ? `<link rel="dns-prefetch" href="${new URL(m3u8Url).origin}">` : ""}
                `.trim();
                setSpeedCode(speedHtml);
            } catch (error) {
                console.error("Error generating embed code:", error);
                setEmbedCode("Error: Unable to load embed code.");
                setSpeedCode("Error: Unable to load speed optimization code.");
            } finally {
                setLoading(false);
            }
        };

        const fetchFavoredIntegrations = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No authentication token found.");
                    return;
                }

                const response = await fetch(`/api/getUserDetails`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) throw new Error("Failed to fetch user data.");

                const userData = await response.json();
                console.log("User data response:", userData); // ✅ Debugging

                if (userData.favoredIntegrations && Array.isArray(userData.favoredIntegrations)) {
                    setFavoredIntegrations(userData.favoredIntegrations);
                } else {
                    console.warn("favoredIntegrations not found in user data.");
                }
            } catch (error) {
                console.error("Error fetching favored integrations:", error);
            }
        };

        if (videoId) fetchEmbedCode();
        fetchFavoredIntegrations();
    }, [videoId]);

    return (
        <div className={styles.stepContainer}>
            <h2 className={styles.title}>Add VSL to your Website</h2>

            <div className={styles.wrapperEmbedOuter}>
                <div className={styles.wrapperEmbed}>
                    {/* Tab Navigation */}
                    <div className={styles.tabNavigation}>
                        <button className={`${styles.tabButton} ${activeTab === "embed" ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab("embed")}>
                            Embed Code
                        </button>
                        <button className={`${styles.tabButton} ${activeTab === "speed" ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab("speed")}>
                            Super Fast Delivery
                        </button>
                    </div>

                    {/* Embed Code Section */}
                    <div className={styles.embedSection}>
                        {loading ? (
                            <p className={styles.loadingText}>Loading embed code...</p>
                        ) : (
                            <>
                                <div className={styles.embedCodeWrapper}>
                                    <textarea value={activeTab === "embed" ? embedCode : speedCode} readOnly
                                              className={styles.embedCode}/>
                                </div>
                                <button className={styles.copyButton}
                                        onClick={() => navigator.clipboard.writeText(embedCode)}>
                                    Copy Code
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 🛠️ Suggested Integration Guide */}
            <div className={styles.guideSectionWrapper}>
                <div className={styles.guideSection}>
                    <h3 className={styles.guideTitle}>Need Help Adding the Player?</h3>
                    <p className={styles.guideSubtitle}>Here are recommended guides based on your platform
                        preference.</p>

                    {/* Display Suggested Integrations */}
                    <div className={styles.integrationGrid}>
                        {favoredIntegrations.length > 0 ? (
                            favoredIntegrations.slice(0, 3).map((integration, index) => (
                                <button key={index} className={styles.metric3}
                                        onClick={() => window.open(`/guide?integration=${integration}`, '_blank')}>
                                    <Image src={integrationIcons[integration]} alt={integration} width={32} height={32}
                                           className={styles.integrationIcon}/>
                                    {integration.charAt(0).toUpperCase() + integration.slice(1)}
                                </button>
                            ))
                        ) : (
                            <p className={styles.guideNote}>No preferred integrations found.</p>
                        )}
                    </div>

                    {/* Button to Explore All Guides */}
                    <div className={styles.exploreButtonWrapper}>
                        <button className={styles.exploreButton} onClick={() => router.push("/guide")}>
                            Explore All Integration Guides
                        </button>
                    </div>

                </div>
            </div>

            <button className={styles.finishButton} onClick={() => router.push("/videos")} disabled={loading}>
                {loading ? "Saving..." : "Finish"}
            </button>
        </div>
    );
};

export default StepThree;
