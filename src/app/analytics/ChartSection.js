import React from "react";
import { Bar, Line } from "react-chartjs-2";
import Image from "next/image";
import styles from "./analytics.module.css";

const ChartSection = ({ activeChart, setActiveChart, activeFilter, setActiveFilter }) => {
    const metrics = ["Total Views", "Play Rate", "Avg View Rate", "Pitch Retention"];
    const chartType = [
        { label: "Bar Chart", imgSrc: "/barChart.png" },
        { label: "Line Chart", imgSrc: "/lineChart.png" },
    ];

    const chartData = {
        labels: Array(90).fill(0).map((_, i) => `Day ${i + 1}`),
        datasets: [
            {
                label: activeFilter,
                backgroundColor: "#99512A",
                borderColor: "#D87C32",
                data: Array(90).fill(0).map(() => Math.floor(Math.random() * 2000)),
                fill: false,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { grid: { display: false }, ticks: { maxRotation: 0, minRotation: 0 } },
            y: { beginAtZero: true, grid: { display: false }, ticks: { precision: 0 } },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: "index",
                intersect: false,
                callbacks: { label: (context) => `${context.dataset.label}: ${context.raw}` }
            },
        },
    };

    return (
        <>
            <div className={styles.topRow}>
                <div className={styles.filters}>
                    {metrics.map((metric) => (
                        <button
                            key={metric}
                            className={`${styles.filterButton} ${activeFilter === metric ? styles.active : ""}`}
                            onClick={() => setActiveFilter(metric)}
                        >
                            {metric}
                        </button>
                    ))}
                </div>
                <div className={styles.chartType}>
                    {chartType.map((chart) => (
                        <button
                            key={chart.label}
                            className={`${styles.filterButton} ${activeChart === chart.label ? styles.active : ""}`}
                            onClick={() => setActiveChart(chart.label)}
                        >
                            <Image src={chart.imgSrc} alt={chart.label} width={16} height={16} className={styles.chartIcon} />
                        </button>
                    ))}
                </div>
            </div>
            <div className={styles.chartContainer}>
                {activeChart === "Bar Chart" ? <Bar data={chartData} options={chartOptions} /> : <Line data={chartData} options={chartOptions} />}
            </div>
        </>
    );
};

export default ChartSection;
