"use client"
import React from "react";
import UpperSection from "../components/home/UpperSection";
import LowerSection from "../components/home/LowerSection";
import Layout from "../components/LayoutHS";

const Home = () => {
    // Data for the upper section (with trendData included)
    const overallPerformance = [
        {
            label: "Total Views",
            value: "435",
            trendData: [100, 200, 300, 400, 435],
        },
        {
            label: "CTA Clicks",
            value: "253",
            trendData: [50, 150, 200, 250, 253],
        },
        {
            label: "Play Rate",
            value: "67.2%",
            trendData: [20, 40, 60, 67, 67.2],
        },
        {
            label: "Average View Rate",
            value: "5.6 min",
            trendData: [1, 3, 4, 5.5, 5.6],
        },
        {
            label: "Pitch Retention",
            value: "47%",
            trendData: [10, 30, 40, 46, 47],
        },
    ];

    // Data for the lower section
    const videoPerformance = [
        {
            thumbnail: "/videoThumbnail.png",
            views: 51,
            uniqueViews: 47,
            playRate: "77.5%",
            pitchRetention: "77.5%",
            engagement: "45.5%",
            buttonClicks: 86,
        },
        {
            thumbnail: "/videoThumbnail.png",
            views: 51,
            uniqueViews: 47,
            playRate: "77.5%",
            pitchRetention: "77.5%",
            engagement: "45.5%",
            buttonClicks: 86,
        },
        // Add more entries as needed
    ];

    return (
        <Layout>
            {/* Pass overallPerformance to UpperSection */}
            <UpperSection data={overallPerformance} />
            {/* Pass videoPerformance to LowerSection */}
            <LowerSection data={videoPerformance} />
        </Layout>
    );
};

export default Home;
