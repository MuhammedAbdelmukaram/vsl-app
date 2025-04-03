"use client";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import styles from "./RetentionGraph.module.css";
import { decodeJwt } from "jose";
import Image from "next/image";

const RetentionGraph = ({ selectedVideo }) => {
    const [retentionData, setRetentionData] = useState(null);
    const [activeChart, setActiveChart] = useState("Line Chart");

    const chartType = [
        { label: "Line Chart", imgSrc: "/lineChart.png" },
        { label: "Bar Chart", imgSrc: "/barChart.png" },
    ];

    useEffect(() => {
        const fetchRetention = async () => {
            if (!selectedVideo) return;

            const token = localStorage.getItem("token");
            if (!token) return;

            let accountId;
            try {
                const decoded = decodeJwt(token);
                accountId = decoded.id;
            } catch (err) {
                console.error("Failed to decode token", err);
                return;
            }

            const res = await fetch(
                `/api/analytics/retention?videoId=${selectedVideo._id}&accountId=${accountId}`
            );
            const data = await res.json();
            setRetentionData(data.retentionData);
        };

        fetchRetention();
    }, [selectedVideo]);

    const chartData = retentionData
        ? {
            labels: retentionData.map((d) => d.time.toString()),
            datasets: [
                activeChart === "Line Chart"
                    ? {
                        label: "Viewer Retention",
                        data: retentionData.map((d) => d.retention),
                        borderColor: "#D87C32",
                        backgroundColor: "rgba(237, 99, 0, 0.2)", // area fill
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        borderWidth: 2,
                    }
                    : {
                        label: "Viewer Retention",
                        data: retentionData.map((d) => d.retention),
                        backgroundColor: "#ED6300", // bar color
                        borderColor: "#D87C32",
                        borderWidth: 1,
                    },
            ],
        }
        : {
            labels: [],
            datasets: [],
        };

    const retentionOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { grid: { display: false }, ticks: { color: "#fff" } },
            y: { beginAtZero: true, grid: { display: false }, ticks: { color: "#fff" } },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#222",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "#ED6300",
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    title: (context) => `Time: ${context[0].label}s`,
                    label: (context) => `Retention: ${context.raw}%`,
                },
            },
        },
    };

    return (
        <div className={styles.retentionContainer}>
            <div className={styles.videoPlaceholder}>
                <p>Video Placeholder</p>
            </div>

            <div className={styles.graphContainer}>
                <div className={styles.header}>
                    <h3>Retention Graph</h3>

                    <div className={styles.chartType}>
                        {chartType.map((chart) => (
                            <button
                                key={chart.label}
                                className={`${styles.filterButton} ${
                                    activeChart === chart.label ? styles.active : ""
                                }`}
                                onClick={() => setActiveChart(chart.label)}
                            >
                                <Image
                                    src={chart.imgSrc}
                                    alt={chart.label}
                                    width={16}
                                    height={16}
                                    className={styles.chartIcon}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.graph}>
                    {activeChart === "Bar Chart" ? (
                        <Bar data={chartData} options={retentionOptions} />
                    ) : (
                        <Line data={chartData} options={retentionOptions} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RetentionGraph;
