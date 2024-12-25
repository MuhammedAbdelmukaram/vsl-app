import React from 'react';
import styles from "./General.module.css";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
} from "chart.js";
import {Line} from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);
const General = () => {


// Register Chart.js components

    const generateChartData = (trendData) => ({
        labels: trendData.map((_, index) => index + 1),
        datasets: [
            {
                data: trendData,
                borderColor: "#D45900",
                backgroundColor: "rgba(255, 165, 0, 0.2)",
                borderWidth: 4,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
        ],
    });

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {display: false},
            tooltip: {enabled: false},
        },
        scales: {
            x: {display: false},
            y: {display: false},
        },
    };

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
        <div className={styles.metrics}>
            {overallPerformance.map((metric, index) => (
                <div className={styles.metric} key={index}>
                    <div className={styles.metricContent}>
                        <p className={styles.label}>{metric.label}</p>
                        <div className={styles.cardLower}>

                            <div className={styles.metricValue}>
                                <p className={styles.value}>{metric.value}</p>
                                <p className={styles.metricSmall}>{metric.metric}</p>
                            </div>

                            <div className={styles.trendLine}>
                                <Line
                                    data={generateChartData(metric.trendData)}
                                    options={chartOptions}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default General;