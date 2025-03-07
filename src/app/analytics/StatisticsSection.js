"use client";
import React from "react";
import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import styles from "./analytics.module.css";

const StatsSection = () => {
    // **Session Device Data (Doughnut)**
    const deviceData = [
        {name: "Mobile", value: 615, color: "#7D5FFF"},
        {name: "Desktop", value: 194, color: "#2ECC71"},
        {name: "Tablet", value: 236, color: "#F1C40F"},
    ];

    // **Countries Data (Bar Chart)**
    const countryData = [
        {name: "United States", value: 180458},
        {name: "United Kingdom", value: 170458},
        {name: "Canada", value: 150458},
        {name: "Germany", value: 130458},
        {name: "Italy", value: 110458},
        {name: "Netherlands", value: 90458},
        {name: "Australia", value: 56458},
        {name: "New Zealand", value: 50458},
        {name: "France", value: 30458},
    ];

    // **Traffic Source (Stacked Bar)**
    const trafficData = [
        {source: "Direct", value: 30.4, color: "#7D5FFF"},
        {source: "Referral", value: 23.4, color: "#3498DB"},
        {source: "Organic Search", value: 20.9, color: "#2ECC71"},
        {source: "Social", value: 13.4, color: "#E74C3C"},
        {source: "Other", value: 11.4, color: "#95A5A6"},
    ];

    const renderCustomLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index, value}) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 15;  // Adjust the "15" to push text outward
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill={"#fff"}
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                fontSize="14px"
                fontWeight="bold"
            >
                {value} views
            </text>
        );
    };


    const maxVal = Math.max(...countryData.map(item => item.value));


    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.gridContainer}>

                {/* **Session Device (Doughnut Chart) - Top Left** */}
                <div className={`${styles.card} ${styles.offsetUp}`}>
                    <h3>Session Device</h3>
                    <div className={styles.chartRow}>
                        <div className={styles.legendContainer}>
                            {deviceData.map((device, index) => (
                                <div key={index} className={styles.legendItem}>
                                    <span className={styles.legendColor} style={{backgroundColor: device.color}}></span>
                                    <span className={styles.legendText}>{device.name}</span>
                                    <span
                                        className={styles.legendPercentage}>({((device.value / 1045) * 100).toFixed(1)}%)</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.pieChart}>


                            <ResponsiveContainer width={270} height={260} aspect={1}>
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        dataKey="value"
                                        strokeWidth="0px"
                                        viewBox={"270px"}
                                        label={renderCustomLabel}  // ✅ Use the custom label function
                                    >
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                </PieChart>
                            </ResponsiveContainer>

                        </div>
                    </div>
                </div>

                <div className={`${styles.card} ${styles.offsetDown}`}>
                    <h3 className={styles.tableTitle}>Browser Usage</h3>
                    <div className={styles.table}>
                        {/* Table Header */}
                        <div className={styles.tableHeader}>
                            <div className={styles.browserInfo}></div>
                            <span className={styles.headerText}>SESSIONS</span>
                            <span className={styles.headerText}>PLAY RATE</span>
                        </div>

                        {[
                            {name: "Safari", icon: "/safari.svg"},
                            {name: "Chrome", icon: "/chrome.svg"},
                            {name: "Explorer", icon: "/explorer.svg"},
                            {name: "Android", icon: "/android.svg"},
                            {name: "Edge", icon: "/edge.svg"},
                        ].map((browser, index) => (
                            <div key={index} className={styles.tableRow}>
                                <div className={styles.browserInfo}>
                                    <img src={browser.icon} alt={browser.name} className={styles.browserIcon}/>
                                    <span className={styles.browserName}>{browser.name}</span>
                                </div>
                                <span className={styles.boldNumber}>28,392</span>
                                <span className={styles.boldNumber}>28,392</span>
                            </div>
                        ))}
                    </div>
                </div>


                {/* **Countries (Horizontal Bar Chart) - Bottom Left** */}
                <div className={styles.card} style={{transform: "translateY(-30px)"}}>
                    <h3 style={{ marginBottom: 32 }}>Countries</h3>
                    <div className={styles.chartContainer2}>
                        {countryData.map((country, index) => (
                            <div key={index} className={styles.chartItem}>
                                <div className={styles.progressContainer}>
                                    <span className={styles.label}>{country.name}</span>
                                    <div className={styles.progressWrapper}>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{
                                                    width: `${(country.value / maxVal) * 100}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className={styles.valueCountry}>
                            {country.value.toLocaleString()}
                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* **Traffic Source (Stacked Bar Chart) - Bottom Right** */}
                <div className={styles.card}>
                    <h3 className={styles.tableTitle}>Traffic Source</h3>

                    {/* Table Header */}
                    <div className={styles.tableHeader}>
                        <div className={styles.browserInfo}></div>
                        <span className={styles.headerText}>SESSIONS</span>
                        <span className={styles.headerText}>LAST 24h</span>
                    </div>

                    {/* Table Rows */}
                    <div className={styles.table}>
                        {[
                            { source: "Direct", value: 30.4, color: "#7D5FFF", sessions: "225,024", last24h: "24,024" },
                            { source: "Referral", value: 23.4, color: "#3498DB", sessions: "170,234", last24h: "20,234" },
                            { source: "Organic Search", value: 20.9, color: "#2ECC71", sessions: "56,456", last24h: "7,456" },
                            { source: "Social", value: 13.4, color: "#E74C3C", sessions: "12,455", last24h: "2,455" },
                            { source: "Other", value: 11.4, color: "#777777", sessions: "1,433", last24h: "124" },
                        ].map((item, index) => (
                            <div key={index} className={styles.tableRow}>
                                <div className={styles.browserInfo}>
                                    <span className={styles.legendColor} style={{ backgroundColor: item.color }}></span>
                                    <span className={styles.sourceText}>{item.source}</span>
                                </div>
                                <span className={styles.boldNumber}>{item.sessions}</span>
                                <span className={styles.boldNumber}>{item.last24h}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.stackedBarContainer}>
                        <div className={styles.barChart}>
                            {[
                                { source: "Direct", value: 30.4, color: "#7D5FFF" },
                                { source: "Referral", value: 23.4, color: "#3498DB" },
                                { source: "Organic Search", value: 20.9, color: "#2ECC71" },
                                { source: "Social", value: 13.4, color: "#E74C3C" },
                                { source: "Other", value: 11.4, color: "#777777" },
                            ].map((entry, index) => (
                                <div
                                    key={index}
                                    className={styles.barSegment}
                                    style={{ backgroundColor: entry.color, width: `${entry.value}%` }}
                                >
                                    <span className={styles.percentageLabel}>{entry.value}%</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.barLabels}>
                            {["Direct", "Referral", "Organic Search", "Social", "Other"].map((label, index) => (
                                <span key={index} className={styles.barLabel}>{label}</span>
                            ))}
                        </div>
                    </div>

                </div>


            </div>
        </div>
    );
};

export default StatsSection;
