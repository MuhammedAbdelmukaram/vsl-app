import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "@/app/components/home/upperSection.module.css";

const Calendar = ({ showDropdown, toggleDropdown, selectedRange, handleRangeSelect, customDates, setCustomDates }) => {
    // Function to determine date range based on selection
    const updateDateRange = (range) => {
        const today = new Date();
        let fromDate = "";
        let toDate = "";

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

        // Update both selected range and custom input values
        handleRangeSelect(range);
        setCustomDates({ from: fromDate, to: toDate });
    };

    // Function to handle custom range selection and update the button text
    const applyCustomRange = () => {
        if (customDates.from && customDates.to) {
            const formattedRange = `From ${customDates.from.toLocaleDateString()} to ${customDates.to.toLocaleDateString()}`;
            handleRangeSelect(formattedRange);
        }
    };

    return (
        <div className={styles.dropdownContainer}>
            <button className={styles.calendarButton} onClick={toggleDropdown}>
                <img src="/calendar-icon.png" alt="Calendar" className={styles.calendarIcon} />
                {selectedRange} {/* ✅ Will show custom range when applied */}
            </button>
            {showDropdown && (
                <div className={styles.dropdownMenu}>
                    <div className={styles.options}>
                        <button onClick={() => updateDateRange("Today")}>Today</button>
                        <button onClick={() => updateDateRange("This Week")}>This Week</button>
                        <button onClick={() => updateDateRange("This Month")}>This Month</button>
                        <button onClick={() => updateDateRange("Last Month")}>Last Month</button>
                    </div>

                    <div className={styles.customRange}>
                        <p>Custom Range:</p>
                        <div style={{ color: "#fff", display: "flex", gap: "10px", alignItems: "center" }}>
                            <DatePicker
                                selected={customDates.from}
                                onChange={(date) => setCustomDates({ ...customDates, from: date })}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="From"
                                className={styles.datePicker}
                            />
                            <DatePicker
                                selected={customDates.to}
                                onChange={(date) => setCustomDates({ ...customDates, to: date })}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="To"
                                className={styles.datePicker}
                                popperClassName={styles.datePickerPopup}
                                popperPlacement="bottom-start"
                                portalId="root-portal"
                            />
                        </div>
                        <button onClick={applyCustomRange}>Apply</button> {/* ✅ Now updates button text */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
