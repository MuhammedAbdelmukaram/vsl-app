import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "@/app/components/home/upperSection.module.css";

const Calendar = ({ showDropdown, toggleDropdown, selectedRange, handleRangeSelect, customDates, setCustomDates }) => {
    // Function to determine date range based on selection
    const updateDateRange = (range) => {
        const today = new Date();
        let fromDate = null;
        let toDate = null;

        switch (range) {
            case "Last 30 Days":
                fromDate = new Date(today);
                fromDate.setDate(today.getDate() - 29);
                toDate = today;
                break;


            case "This Week": {
                const currentDay = today.getDay(); // Sunday = 0
                const monday = new Date(today);
                monday.setDate(today.getDate() - ((currentDay + 6) % 7));
                monday.setHours(0, 0, 0, 0);

                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);
                sunday.setHours(23, 59, 59, 999);

                fromDate = monday;
                toDate = sunday;
                break;
            }

            case "This Month": {
                fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
                toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // last day of current month
                break;
            }

            case "Last Month":
                fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                toDate = new Date(today.getFullYear(), today.getMonth(), 0); // last day of last month
                break;

            default:
                return;
        }

        handleRangeSelect(range, { from: fromDate, to: toDate });
    };



    // Function to handle custom range selection and update the button text
    const applyCustomRange = () => {
        if (customDates.from && customDates.to) {
            const label = `From ${customDates.from.toLocaleDateString()} to ${customDates.to.toLocaleDateString()}`;
            handleRangeSelect(label, customDates);
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
                        <button onClick={() => updateDateRange("This Week")}>This Week</button>
                        <button onClick={() => updateDateRange("Last 30 Days")}>Last 30 Days</button>
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
                                popperClassName={styles.datePickerPopup}
                                popperPlacement="bottom-start"
                                portalId="root-portal"
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
