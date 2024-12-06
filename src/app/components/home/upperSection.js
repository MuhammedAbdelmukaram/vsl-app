import React from "react";
import styles from "./upperSection.module.css";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

const UpperSection = ({ data }) => {
    const generateChartData = (trendData) => ({
        labels: trendData.map((_, index) => index + 1),
        datasets: [
            {
                data: trendData,
                borderColor: "#ffa500",
                backgroundColor: "rgba(255, 165, 0, 0.2)",
                borderWidth: 2,
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
            legend: { display: false },
            tooltip: { enabled: false },
        },
        scales: {
            x: { display: false },
            y: { display: false },
        },
    };

    return (
        <div className={styles.upperSection}>
            <div className={styles.header}>
                <h2 >Overall Performance</h2>
                <button className={styles.calendarButton}>
                    <img
                        src="/calendar-icon.png"
                        alt="Calendar"
                        className={styles.calendarIcon}
                    />
                    This Month
                </button>
            </div>
            <div className={styles.metrics}>
                {data.map((metric, index) => (
                    <div className={styles.metric} key={index}>
                        <div className={styles.metricContent}>
                            <p className={styles.label}>{metric.label}</p>
                            <div className={styles.cardLower} >


                            <p className={styles.value}>{metric.value}</p>
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
        </div>
    );
};

export default UpperSection;
