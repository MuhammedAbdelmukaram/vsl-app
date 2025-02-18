"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import styles from "./RetentionGraph.module.css";
import Image from "next/image";

const RetentionGraph = () => {
    const retentionData = {
        labels: Array(50).fill(0).map((_, i) => `${i + 1}`),
        datasets: [
            {
                label: "Retention",
                backgroundColor: "#ED6300",
                borderColor: "#D87C32",
                data: Array(50).fill(0).map(() => Math.floor(Math.random() * 2400)),
            },
        ],
    };

    const retentionOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { display: false } },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `Views: ${context.raw}`,
                },
            },
        },
    };

    return (
        <div className={styles.retentionContainer}>
            <div className={styles.header}>
                <Image src="/retentionIcon.png" alt="Retention" width={20} height={20} />
                <h3>Retention Graph</h3>
                <button className={styles.toggleButton}>
                    <Image src="/barChart.png" alt="Bar Chart" width={16} height={16} />
                </button>
            </div>

            <div className={styles.graph}>
                <Bar data={retentionData} options={retentionOptions} />
            </div>
        </div>
    );
};

export default RetentionGraph;
