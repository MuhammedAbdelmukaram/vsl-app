import React from "react";
import styles from "./analytics.module.css";

const StatisticsSection = () => {
    const data = {
        Countries: [
            { value: 253, label: 'USA' },
            { value: 198, label: 'India' },
            { value: 145, label: 'UK' },
            { value: 132, label: 'Germany' },
            { value: 120, label: 'France' },
        ],
        Devices: [
            { value: '67.2%', label: 'Mobile' },
            { value: '20.5%', label: 'Desktop' },
            { value: '12.3%', label: 'Tablet' },
        ],
    };

    return (
        <div className={styles.statisticsContainer}>
            <div className={styles.statisticsGrid}>
                {Object.entries(data).map(([category, stats], index) => (
                    <div key={index} className={styles.categoryBox}>
                        <h3 className={styles.categoryTitle}>{category}</h3>
                        {stats.map((stat, idx) => (
                            <div key={idx} className={styles.statBox}>
                                <p className={styles.statValue}>{stat.value}</p>
                                <p className={styles.statLabel}>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatisticsSection;
