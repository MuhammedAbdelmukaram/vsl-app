import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import Image from "next/image";
import styles from "./analytics.module.css";
import Calendar from "@/app/components/Calendar";
import { eachDayOfInterval, format } from "date-fns";

const ChartSection = ({ activeChart, setActiveChart, activeFilter, setActiveFilter,selectedVideo , selectedRange, setSelectedRange, customDates, setCustomDates}) => {
    const metrics = [
        "Page Views",
        "Unique Page Views",
        "Total Plays",
        "Unique Plays",
        "Returned Watchers", // 👈 New
        "Play Rate",
    ];


    const chartType = [
        { label: "Bar Chart", imgSrc: "/barChart.png" },
        { label: "Line Chart", imgSrc: "/lineChart.png" },
    ];

    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => setShowDropdown((prev) => !prev);

    const handleRangeSelect = (range, newDates) => {
        setSelectedRange(range);
        setCustomDates(newDates);
        setShowDropdown(false);
    };

    useEffect(() => {
        const fetchChartData = async () => {
            if (!customDates.from || !customDates.to || !selectedVideo) return;
            setIsLoading(true);

            try {
                const from = customDates.from.toISOString();
                const to = customDates.to.toISOString();

                const res = await fetch(
                    `/api/analytics/graph?filter=${encodeURIComponent(activeFilter)}&from=${from}&to=${to}&videoId=${selectedVideo._id}&accountId=${selectedVideo.user}`
                );

                const rawData = await res.json();

                // 🔁 Create date range
                const allDates = eachDayOfInterval({
                    start: new Date(customDates.from),
                    end: new Date(customDates.to),
                }).map(date => format(date, "yyyy-MM-dd"));

                // 🧠 Create map from API data
                const dataMap = Object.fromEntries(rawData.map(entry => [entry._id, entry.count]));

                // 📊 Fill gaps with 0
                const labels = allDates;
                const values = allDates.map(date => dataMap[date] || 0);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: activeFilter,
                            backgroundColor: "#99512A",
                            borderColor: "#D87C32",
                            data: values,
                            fill: false,
                            tension: 0.4, // 👈 smooth curve (0 = straight lines, 1 = max curve)
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
    }, [activeFilter, customDates, selectedVideo]);

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
                    <div className={styles.loader}>
                        <div className={styles.ring}></div>
                    </div>
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
