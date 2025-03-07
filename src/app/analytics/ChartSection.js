import React, {useState} from "react";
import {Bar, Line} from "react-chartjs-2";
import Image from "next/image";
import styles from "./analytics.module.css";
import Calendar from "@/app/components/Calendar";

const ChartSection = ({activeChart, setActiveChart, activeFilter, setActiveFilter}) => {
    const metrics = ["Total Views", "Play Rate", "Avg View Rate", "Pitch Retention"];
    const chartType = [
        {label: "Bar Chart", imgSrc: "/barChart.png"},
        {label: "Line Chart", imgSrc: "/lineChart.png"},
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
            x: {grid: {display: false}, ticks: {maxRotation: 0, minRotation: 0}},
            y: {beginAtZero: true, grid: {display: false}, ticks: {precision: 0}},
        },
        plugins: {
            legend: {display: false},
            tooltip: {
                mode: "index",
                intersect: false,
                callbacks: {label: (context) => `${context.dataset.label}: ${context.raw}`}
            },
        },
    };

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRange, setSelectedRange] = useState("This Month");
    const [customDates, setCustomDates] = useState({from: null, to: null});

    const toggleDropdown = () => setShowDropdown((prev) => !prev);

    const handleRangeSelect = (range) => {
        const today = new Date();
        let fromDate = null;
        let toDate = null;

        switch (range) {
            case "Today":
                fromDate = toDate = today;
                break;
            case "This Week":
                fromDate = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week
                toDate = new Date();
                break;
            case "This Month":
                fromDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
                toDate = new Date();
                break;
            case "Last Month":
                fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); // First day of last month
                toDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month
                break;
            default:
                return;
        }

        setSelectedRange(range);
        setCustomDates({from: fromDate, to: toDate});
        setShowDropdown(false);
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
                                <Image src={chart.imgSrc} alt={chart.label} width={16} height={16}
                                       className={styles.chartIcon}/>
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
                            setCustomDates={setCustomDates} // ✅ Pass this prop
                        />
                    </div>
                </div>
            </div>
            <div className={styles.chartContainer}>
                {activeChart === "Bar Chart" ? <Bar data={chartData} options={chartOptions}/> :
                    <Line data={chartData} options={chartOptions}/>}
            </div>
        </>
    );
};

export default ChartSection;
