"use client";
import React, {useEffect, useRef, useState} from "react";
import {Bar, Line} from "react-chartjs-2";
import "chart.js/auto";
import styles from "./RetentionGraph.module.css";
import {decodeJwt} from "jose";
import Image from "next/image";
import VideoPlayer from "@/app/analytics-video-player/VideoPlayer";

const RetentionGraph = ({selectedVideo}) => {
    const [retentionData, setRetentionData] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [activeChart, setActiveChart] = useState("Line Chart");
    const [videoLength, setVideoLength] = useState(null);
    const playerRef = useRef(null);
    const [filters, setFilters] = useState({
        device: "",
        browser: ""
    });

    const handleFilterChange = (e) => {
        const {name, value} = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    };


    const chartType = [
        {label: "Line Chart", imgSrc: "/lineChart.png"},
        {label: "Bar Chart", imgSrc: "/barChart.png"},
    ];

    useEffect(() => {
        const fetchRetention = async () => {
            if (!selectedVideo) return;

            const token = localStorage.getItem("token");
            if (!token) return;

            let accountId;
            try {
                const decoded = decodeJwt(token);
                accountId = decoded.id;
            } catch (err) {
                console.error("Failed to decode token", err);
                return;
            }

            const queryParams = new URLSearchParams({
                videoId: selectedVideo._id,
                accountId,
            });

            if (filters.device) queryParams.append("device", filters.device);
            if (filters.browser) queryParams.append("browser", filters.browser);

            const res = await fetch(`/api/analytics/retention?${queryParams.toString()}`);

            const data = await res.json();
            let filled = [...data.retentionData];

            const totalSeconds = Math.floor(data.videoLength); // ✅ use this from the API

            // ✅ Ensure we always include the last second
            for (let i = 0; i <= totalSeconds; i++) {
                if (!filled.find((d) => d.time === i)) {
                    filled.push({time: i, retention: 0});
                }
            }

            filled.sort((a, b) => a.time - b.time);
            setRetentionData(filled);
            setVideoLength(totalSeconds); // ✅ store it
            setLoading(false)

        };

        fetchRetention();
    }, [selectedVideo, filters]);


    const chartData = retentionData
        ? {
            labels: retentionData.map((d) => d.time.toString()),
            datasets: [
                activeChart === "Line Chart"
                    ? {
                        label: "Viewer Retention",
                        data: retentionData.map((d) => d.retention),
                        borderColor: "#D87C32",
                        backgroundColor: "rgba(237, 99, 0, 0.2)", // area fill
                        fill: true,
                        tension: 0,
                        pointRadius: 0,
                        borderWidth: 2,
                    }
                    : {
                        label: "Viewer Retention",
                        data: retentionData.map((d) => d.retention),
                        backgroundColor: "#ED6300", // bar color
                        borderColor: "#D87C32",
                        borderWidth: 1,
                    },
            ],
        }
        : {
            labels: [],
            datasets: [],
        };

    const retentionOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        onHover: (event, chartElements) => {
            if (event?.native?.target) {
                event.native.target.style.cursor =
                    chartElements.length > 0 ? "pointer" : "default";
            }
        },
        onClick: (event, elements, chart) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const time = parseInt(chart.data.labels[index]);

                console.log("Seek to:", time);

                if (playerRef.current && playerRef.current.seekTo) {
                    playerRef.current.seekTo(time, "seconds");
                }

                // ✅ Trigger overlay logic after seeking
                if (playerRef.current && playerRef.current.handleOverlayClick) {
                    playerRef.current.handleOverlayClick();
                }
            }
        },


        scales: {
            x: {
                grid: {display: false},
                min: 0,
                max: videoLength || undefined,
                ticks: {
                    color: "#fff",
                    maxTicksLimit: 4,
                    callback: function (value) {
                        const seconds = parseInt(this.getLabelForValue(value));
                        const minutes = Math.floor(seconds / 60);
                        const secs = seconds % 60;
                        return `${minutes}:${secs.toString().padStart(2, "0")}`;
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {display: false},
                ticks: {color: "#fff"},
            },
        },
        plugins: {
            legend: {display: false},
            tooltip: {
                backgroundColor: "#222",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "#ED6300",
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    title: (context) => {
                        const seconds = parseInt(context[0].label);
                        const minutes = Math.floor(seconds / 60);
                        const secs = seconds % 60;
                        return `Time: ${minutes}:${secs.toString().padStart(2, "0")}`;
                    },
                    label: (context) => `Retention: ${context.raw}%`,
                },
            },
        },
    };

    console.log("Video URL being passed to player:", selectedVideo?.videoUrl);


    return (<div>
            <div className={styles.filters}>
                <select name="device" value={filters.device} onChange={handleFilterChange}>
                    <option value="">All Devices</option>
                    <option value="desktop">Desktop</option>
                    <option value="mobile">Mobile</option>
                    <option value="tablet">Tablet</option>
                </select>


                <select name="browser" value={filters.browser} onChange={handleFilterChange}>
                    <option value="">All Browsers</option>
                    <option value="Chrome">Chrome</option>
                    <option value="Safari">Safari</option>
                    <option value="Firefox">Firefox</option>
                    <option value="Edge">Edge</option>
                    <option value="Opera">Opera</option>
                </select>
            </div>


            <div className={styles.retentionContainer}>
                <div className={styles.videoPlaceholder}>
                    <VideoPlayer
                        url={selectedVideo.videoUrl}
                        exitThumbnailButtons={false}
                        exitThumbnail={false}
                        autoPlay={true}
                        live={false}
                        ref={playerRef}
                    />
                </div>

                <div className={styles.graphContainer}>
                    {loading ? (
                        <div className={styles.loader}>
                            <div className={styles.ring}></div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.header}>
                                <h3>Retention Graph</h3>

                                <div className={styles.chartType}>
                                    {chartType.map((chart) => (
                                        <button
                                            key={chart.label}
                                            className={`${styles.filterButton} ${
                                                activeChart === chart.label ? styles.active : ""
                                            }`}
                                            onClick={() => setActiveChart(chart.label)}
                                        >
                                            <Image
                                                src={chart.imgSrc}
                                                alt={chart.label}
                                                width={16}
                                                height={16}
                                                className={styles.chartIcon}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.graph}>
                                {activeChart === "Bar Chart" ? (
                                    <Bar data={chartData} options={retentionOptions}/>
                                ) : (
                                    <Line data={chartData} options={retentionOptions}/>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );


};

export default RetentionGraph;
