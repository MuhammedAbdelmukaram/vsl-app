"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import styles from "./RetentionGraph.module.css";
import Image from "next/image";

const RetentionGraph = () => {
    // Sample retention data (random values for now)
    const retentionData = {
        labels: Array(50).fill(0).map((_, i) => `${i + 1}`),
        datasets: [
            {
                label: "Pitch Time",
                backgroundColor: "#ED6300",
                borderColor: "#D87C32",
                borderWidth: 1,
                data: Array(50).fill(0).map(() => Math.floor(Math.random() * 2400)), // Simulating retention
            },
        ],
    };

    // Chart.js options
    const retentionOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#fff" }, // White text for dark mode
            },
            y: {
                beginAtZero: true,
                grid: { display: false },
                ticks: { color: "#fff" },
            },
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
                    title: (context) => `Time: ${context[0].label} sec`,
                    label: (context) => `Views: ${context.raw}`,
                },
            },
        },
    };

    return (
        <div className={styles.retentionContainer}>
            {/* Left Side: Video Placeholder */}
            <div className={styles.videoPlaceholder}>
                <p>Video Placeholder</p>
            </div>

            {/* Right Side: Retention Graph */}
            <div className={styles.graphContainer}>
                <div className={styles.header}>
                    <h3>Retention Graph</h3>
                </div>
                <div className={styles.graph}>
                    <Bar data={retentionData} options={retentionOptions} />
                </div>
            </div>
        </div>
    );
};

export default RetentionGraph;
