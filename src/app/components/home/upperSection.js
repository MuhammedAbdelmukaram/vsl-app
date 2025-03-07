import React, { useState } from "react";
import styles from "./upperSection.module.css";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
} from "chart.js";
import Calendar from "@/app/components/Calendar";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

const UpperSection = ({ data }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRange, setSelectedRange] = useState("This Month");
    const [customDates, setCustomDates] = useState({ from: null, to: null }); // 👈 Changed from "" to null

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
        setCustomDates({ from: fromDate, to: toDate });
        setShowDropdown(false);
    };

    return (
        <div className={styles.upperSection}>
            <div className={styles.header}>
                <h2>Overall Performance</h2>
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
    );
};

export default UpperSection;
