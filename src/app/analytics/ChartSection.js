import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import Image from "next/image";
import styles from "./analytics.module.css";
import Calendar from "@/app/components/Calendar";

const ChartSection = ({ activeChart, setActiveChart, activeFilter, setActiveFilter,selectedVideo }) => {
    const metrics = ["Total Views", "Play Rate", "Avg View Rate", "Pitch Retention"];
    const chartType = [
        { label: "Bar Chart", imgSrc: "/barChart.png" },
        { label: "Line Chart", imgSrc: "/lineChart.png" },
    ];

    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRange, setSelectedRange] = useState("Today");
    const [customDates, setCustomDates] = useState(() => {
        const today = new Date();
        return { from: today, to: today };
    });

    const toggleDropdown = () => setShowDropdown((prev) => !prev);

    const handleRangeSelect = (range, newDates) => {
        setSelectedRange(range);
        setCustomDates(newDates);
        setShowDropdown(false);
    };

    useEffect(() => {
        const fetchChartData = async () => {
            if (!customDates.from || !customDates.to || !selectedVideo) return; // ✅ wait for selectedVideo
            setIsLoading(true);

            try {
                const from = customDates.from.toISOString();
                const to = customDates.to.toISOString();

                const res = await fetch(
                    `/api/analytics/metrics?filter=${encodeURIComponent(activeFilter)}&from=${from}&to=${to}&videoId=${selectedVideo._id}&accountId=${selectedVideo.user}`
                );


                const data = await res.json();
                const labels = data.map((entry) => entry._id);
                const values = data.map((entry) => entry.count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: activeFilter,
                            backgroundColor: "#99512A",
                            borderColor: "#D87C32",
                            data: values,
                            fill: false,
                        },
                    ],
                });
            } catch (error) {
                console.error("Error loading analytics data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChartData();
    }, [activeFilter, customDates, selectedVideo]); // ✅ add selectedVideo to deps

    if (!selectedVideo) return <div>Please select a video to view chart data.</div>;


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
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw}`,
                },
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
                <div className={styles.rightSideWrapper}>
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

                    <div>
                        <Calendar
                            showDropdown={showDropdown}
                            toggleDropdown={toggleDropdown}
                            selectedRange={selectedRange}
                            handleRangeSelect={handleRangeSelect}
                            customDates={customDates}
                            setCustomDates={setCustomDates}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.chartContainer}>
                {isLoading || !chartData ? (
                    <div>Loading chart...</div>
                ) : activeChart === "Bar Chart" ? (
                    <Bar data={chartData} options={chartOptions} />
                ) : (
                    <Line data={chartData} options={chartOptions} />
                )}
            </div>
        </>
    );
};

export default ChartSection;
