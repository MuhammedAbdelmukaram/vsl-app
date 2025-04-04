import React, {useEffect, useState} from "react";
import styles from "./analytics.module.css";

const WeeklyHeatmap = ({selectedVideo, customDates, heatmapData}) => {

    const [hoveredCell, setHoveredCell] = useState(null);


    // TEMPORARILY USING PLACEHOLDER DATA FOR DESIGN PURPOSES
    {/*
        useEffect(() => {
            const placeholder = [];
            for (let hour = 0; hour < 24; hour++) {
                for (let day = 0; day < 7; day++) {
                    placeholder.push({day, hour, count: Math.floor(Math.random() * 30)});
                }
            }
            setHeatmapData(placeholder);
        }, []);
    */}

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const hours = Array.from({length: 24}, (_, i) => i);

    const getCount = (day, hour) =>
        heatmapData.find((d) => d.day === day && d.hour === hour)?.count || 0;

    const maxCount = Math.max(...heatmapData.map((d) => d.count), 0);

    const getClass = (count) => {
        const ratio = count / maxCount;
        if (ratio > 0.75) return styles.level4;
        if (ratio > 0.5) return styles.level3;
        if (ratio > 0.25) return styles.level2;
        if (ratio > 0) return styles.level1;
        return styles.level0;
    };

    return (
        <div className={styles.card3}>
            <div className={styles.heatmapContainer}>
                <h3 className={styles.heatmapTitle}>When Viewers Watch</h3>
                <div className={styles.gridContainer2}>


                    <div className={styles.headerRow}>
                        <div className={styles.hourLabel}></div>
                        {days.map((d) => (
                            <div key={d} className={styles.dayLabel}>{d}</div>
                        ))}
                    </div>

                    {hours.map((hour) => (
                        <div key={hour} className={styles.hourRow}>
                            <div className={styles.hourLabel}>
                                {[0, 6, 12, 18].includes(hour)
                                    ? hour === 0
                                        ? "12AM"
                                        : hour === 12
                                            ? "12PM"
                                            : `${hour % 12} ${hour < 12 ? "AM" : "PM"}`
                                    : ""}
                            </div>

                            {days.map((_, dayIdx) => {
                                const count = getCount(dayIdx, hour);
                                return (
                                    <div
                                        key={`${dayIdx}-${hour}`}
                                        className={`${styles.cell} ${getClass(count)}`}
                                        onMouseEnter={() =>
                                            setHoveredCell({
                                                day: days[dayIdx],
                                                hour,
                                                count,
                                            })
                                        }
                                        onMouseLeave={() => setHoveredCell(null)}
                                    >
                                        {hoveredCell &&
                                            hoveredCell.day === days[dayIdx] &&
                                            hoveredCell.hour === hour && (
                                                <div className={styles.tooltipBox}>
                                                    <strong>{hoveredCell.day}</strong> at{" "}
                                                    {hoveredCell.hour === 0
                                                        ? "12AM"
                                                        : hoveredCell.hour === 12
                                                            ? "12PM"
                                                            : `${hoveredCell.hour % 12} ${
                                                                hoveredCell.hour < 12 ? "AM" : "PM"
                                                            }`}
                                                    <div>{hoveredCell.count} views</div>
                                                </div>
                                            )}
                                    </div>

                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeeklyHeatmap;
