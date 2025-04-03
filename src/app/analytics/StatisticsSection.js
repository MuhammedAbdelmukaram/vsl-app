"use client";
import React, {useEffect, useState} from "react";
import {
    PieChart, Pie, Cell, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import styles from "./analytics.module.css";
import WeeklyHeatmap from "@/app/analytics/WeeklyHeatmap";

const StatsSection = ({selectedVideo, customDates}) => {
    // **Session Device Data (Doughnut)**


    const [deviceData, setDeviceData] = useState([]);
    const [browserData, setBrowserData] = useState([]);
    const [countryData, setCountryData] = useState([]);


    {/*
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
    */
    }
    const knownBrowsers = [
        {name: "Safari", icon: "/safari.svg"},
        {name: "Chrome", icon: "/chrome.svg"},
        {name: "Opera", icon: "/opera.svg"},
        {name: "Android", icon: "/android.svg"},
        {name: "Edge", icon: "/edge.svg"},
        {name: "Other", icon: "/other.png"},
    ];

    const knownDevices = [
        {name: "Mobile", color: "#7D5FFF"},
        {name: "Desktop", color: "#2ECC71"},
        {name: "Tablet", color: "#F1C40F"},
    ];


    useEffect(() => {
        if (!selectedVideo || !customDates.from || !customDates.to) return;

        const fetchStats = async () => {
            try {
                const res = await fetch(
                    `/api/analytics/statistics-section?videoId=${selectedVideo._id}&accountId=${selectedVideo.user}&from=${customDates.from.toISOString()}&to=${customDates.to.toISOString()}`
                );
                const data = await res.json();

                setDeviceData(data.deviceData || []);
                setCountryData(data.countryData || []);

                // Merge and normalize browser data
                const browserMap = new Map();
                data.browserData?.forEach((b) => {
                    browserMap.set(b.name, { value: b.value, sessions: b.sessions });
                });


                const normalizedBrowserData = knownBrowsers.map((b) => {
                    const browser = browserMap.get(b.name);
                    return {
                        name: b.name,
                        icon: b.icon,
                        value: browser?.value || 0,
                        sessions: browser?.sessions || 0,
                    };
                });


                // Sort descending by value
                normalizedBrowserData.sort((a, b) => b.value - a.value);

                setBrowserData(normalizedBrowserData);
            } catch (err) {
                console.error("Failed to fetch statistics section data", err);
            }
        };

        fetchStats();
    }, [selectedVideo, customDates]);


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


    const normalizedDeviceData = knownDevices.map((known) => {
        const found = deviceData.find((d) => d.name.toLowerCase() === known.name.toLowerCase());
        return {
            name: known.name,
            color: known.color,
            value: found?.value || 0,
        };
    });

    const totalDeviceValue = normalizedDeviceData.reduce((sum, d) => sum + d.value, 0);


    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.gridContainer}>

                {/* **Session Device (Doughnut Chart) - Top Left** */}
                <div className={`${styles.card} ${styles.offsetUp}`}>
                    <h3>Session Device</h3>
                    <div className={styles.chartRow}>
                        <div className={styles.legendContainer}>
                            {normalizedDeviceData.map((device, index) => (
                                <div key={index} className={styles.legendItem}>
                                    <span className={styles.legendColor} style={{backgroundColor: device.color}}></span>
                                    <span className={styles.legendText}>{device.name}</span>
                                    <span className={styles.legendPercentage}>
                                         ({totalDeviceValue === 0 ? "0.0" : ((device.value / totalDeviceValue) * 100).toFixed(1)}%)
                                    </span>
                                </div>
                            ))}

                        </div>

                        <div className={styles.pieChart}>


                            <ResponsiveContainer width={270} height={260} aspect={1}>
                                <PieChart>
                                    <Pie
                                        data={normalizedDeviceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        dataKey="value"
                                        strokeWidth="0px"
                                    >
                                        {normalizedDeviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
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
                            <span className={styles.headerText}>PAGE VIEWS</span>
                            <span className={styles.headerText}>PLAYS</span>
                            <span className={styles.headerText}>RATIO</span> {/* ✅ New column */}
                        </div>

                        {browserData.map((browser, index) => {
                            const iconMap = {
                                Safari: "/safari.svg",
                                Chrome: "/chrome.svg",
                                Opera: "/opera.svg",
                                Android: "/android.svg",
                                Edge: "/edge.svg",
                                Other: "/other.png",
                            };

                            const ratio =
                                browser.sessions > 0
                                    ? ((browser.value / browser.sessions) * 100).toFixed(1)
                                    : "0.0";

                            return (
                                <div key={index} className={styles.tableRow}>
                                    <div className={styles.browserInfo}>
                                        <img
                                            src={iconMap[browser.name] || "/other.png"}
                                            alt={browser.name}
                                            className={styles.browserIcon}
                                        />
                                        <span className={styles.browserName}>{browser.name}</span>
                                    </div>
                                    <span className={styles.boldNumber}>
                        {browser.sessions?.toLocaleString() || "0"}
                    </span>
                                    <span className={styles.boldNumber}>
                        {browser.value.toLocaleString()}
                    </span>

                                    <span className={styles.boldNumber}>
                        {ratio}%
                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>




                {/* **Countries (Horizontal Bar Chart) - Bottom Left** */}
                <div className={styles.card2} style={{transform: "translateY(-30px)"}}>
                    <h3 style={{marginBottom: 32}}>Countries</h3>
                    <div className={styles.chartContainer2}>
                        {countryData.length === 0 ? (
                            <div className={styles.placeholder}>
                                <p style={{ textAlign: "center", opacity: 0.7, fontSize: "14px" }}>
                                    Not enough country data yet. Once your video gets more views across countries,
                                    this section will populate automatically.
                                </p>
                            </div>
                        ) : (
                            countryData.map((country, index) => (
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
                            ))
                        )}

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
                            {source: "Direct", value: 30.4, color: "#7D5FFF", sessions: "225,024", last24h: "24,024"},
                            {source: "Referral", value: 23.4, color: "#3498DB", sessions: "170,234", last24h: "20,234"},
                            {
                                source: "Organic Search",
                                value: 20.9,
                                color: "#2ECC71",
                                sessions: "56,456",
                                last24h: "7,456"
                            },
                            {source: "Social", value: 13.4, color: "#E74C3C", sessions: "12,455", last24h: "2,455"},
                            {source: "Other", value: 11.4, color: "#777777", sessions: "1,433", last24h: "124"},
                        ].map((item, index) => (
                            <div key={index} className={styles.tableRow}>
                                <div className={styles.browserInfo}>
                                    <span className={styles.legendColor} style={{backgroundColor: item.color}}></span>
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
                                {source: "Direct", value: 30.4, color: "#7D5FFF"},
                                {source: "Referral", value: 23.4, color: "#3498DB"},
                                {source: "Organic Search", value: 20.9, color: "#2ECC71"},
                                {source: "Social", value: 13.4, color: "#E74C3C"},
                                {source: "Other", value: 11.4, color: "#777777"},
                            ].map((entry, index) => (
                                <div
                                    key={index}
                                    className={styles.barSegment}
                                    style={{backgroundColor: entry.color, width: `${entry.value}%`}}
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


                <WeeklyHeatmap
                    selectedVideo={selectedVideo}
                    customDates={customDates}
                />


            </div>
        </div>
    );
};

export default StatsSection;
