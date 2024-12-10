import React, {useState} from "react";
import styles from "./upperSection.module.css";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
} from "chart.js";
import {Line} from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

const UpperSection = ({data}) => {

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRange, setSelectedRange] = useState("This Month");
    const [customDates, setCustomDates] = useState({from: "", to: ""});

    const toggleDropdown = () => setShowDropdown((prev) => !prev);

    // Function to handle predefined range selection
    const handleRangeSelect = (range) => {
        setSelectedRange(range);
        setShowDropdown(false);
    };

    // Function to handle custom date range input
    const handleCustomDateChange = (e) => {
        const {name, value} = e.target;
        setCustomDates((prev) => ({...prev, [name]: value}));
    };

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

    return (
        <div className={styles.upperSection}>
            <div className={styles.header}>
                <h2>Overall Performance</h2>
                <div className={styles.dropdownContainer}>
                    <button className={styles.calendarButton} onClick={toggleDropdown}>
                        <img src="/calendar-icon.png" alt="Calendar" className={styles.calendarIcon}/>
                        {selectedRange}
                    </button>
                    {showDropdown && (
                        <div className={styles.dropdownMenu}>
                            <button onClick={() => handleRangeSelect("Today")}>Today</button>
                            <button onClick={() => handleRangeSelect("This Week")}>This Week</button>
                            <button onClick={() => handleRangeSelect("This Month")}>This Month</button>
                            <button onClick={() => handleRangeSelect("Last Month")}>Last Month</button>
                            <div className={styles.customRange}>
                                <p>Custom Range:</p>
                                <input
                                    type="date"
                                    name="from"
                                    value={customDates.from}
                                    onChange={handleCustomDateChange}
                                />
                                <input
                                    type="date"
                                    name="to"
                                    value={customDates.to}
                                    onChange={handleCustomDateChange}
                                />
                                <button
                                    onClick={() =>
                                        handleRangeSelect(
                                            `From ${customDates.from || "N/A"} to ${customDates.to || "N/A"}`
                                        )
                                    }
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.metrics}>
                {data.map((metric, index) => (
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
        </div>
    );
};

export default UpperSection;
