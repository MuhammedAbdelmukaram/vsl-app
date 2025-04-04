import React, { useEffect, useState } from "react";
import styles from "./analytics.module.css";
import { Info } from "lucide-react"; // Optional: or use an inline SVG or emoji

const tooltips = {
    "Page Views": "How many times the page with the video player was loaded.",
    "Unique Page Views": "How many different users visited the page (based on device ID).",
    "Total Plays": "How many times the video was played.",
    "Unique Plays": "How many different users played the video.",
    "Avg Watch Time": "The average time (in seconds) users watched the video before stopping.",
    "Avg View Rate": "The average amount of video watched per play.",
    "Avg Daily Plays": "The average number of video plays per day.",
    "Play Rate": "The % of page visitors who clicked play.",
    "Pitch Retention": "The % of viewers who reached the pitch moment in the video.",
    "Returned Watchers": "How many people watched the video more than once (i.e., repeat views).",
    "Repeat View Rate": "The % of unique viewers who watched the video more than once.",
    "Hook Retention": "The % of viewers who watched past the first 15 seconds.",
    "Completion Rate": "The % of viewers who finished the video. (per play)",

};

const VideoStats = ({ selectedVideo, customDates }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!selectedVideo || !customDates.from || !customDates.to) return;
            setLoading(true);

            try {
                const from = customDates.from.toISOString();
                const to = customDates.to.toISOString();

                const res = await fetch(
                    `/api/analytics/stats?videoId=${selectedVideo._id}&accountId=${selectedVideo.user}&from=${from}&to=${to}`
                );
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [selectedVideo, customDates]);

    if (loading || !stats) {
        return <div className={styles.statsContainer}>Loading statistics...</div>;
    }

    const {
        totalViews,
        uniqueViews,
        pageviews,
        uniquePageviews,
        averageViewRate,
        averageDailyViews,
        playRate,
        pitchRetention,
        returnedWatchers,
        repeatViewRate,
        hookRetention,
        completionRate,
        averageWatchTime,
        pitchTime

    } = stats;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };



    const formattedStats = [
        { label: "Page Views", value: pageviews?.toLocaleString() || "-" },
        { label: "Unique Page Views", value: uniquePageviews?.toLocaleString() || "-" },
        { label: "Total Plays", value: totalViews?.toLocaleString() || "-" },
        { label: "Unique Plays", value: uniqueViews?.toLocaleString() || "-" },
        { label: "Play Rate", value: `${playRate?.toFixed(1) || 0}%` },
        { label: "Avg Daily Plays", value: averageDailyViews?.toLocaleString() || "-" },
        { label: "Avg Watch Time", value: formatTime(averageWatchTime || 0) },
        { label: "Avg View Rate", value: `${averageViewRate?.toFixed(1) || 0}%` },
        { label: "Pitch Retention", value: `${pitchRetention?.toFixed(1) || 0}%` },
        { label: "Returned Watchers", value: returnedWatchers?.toLocaleString() || "-" },
        { label: "Repeat View Rate", value: `${repeatViewRate?.toFixed(1) || 0}%` },
        { label: "Hook Retention", value: `${hookRetention?.toFixed(1) || 0}%` },
        { label: "Completion Rate", value: `${completionRate?.toFixed(1) || 0}%` },

    ];

    return (
        <div className={styles.statsContainer}>
            {formattedStats.map((stat, index) => (
                <div key={index} className={styles.statItem}>
                    <div className={styles.textDot}>
                        <span className={styles.label}>
                            {stat.label}
                            <span className={styles.tooltipWrapper}>
                                <Info size={14} className={styles.tooltipIcon} />
                                <span className={styles.tooltipText}>{tooltips[stat.label]}</span>
                            </span>
                        </span>
                    </div>
                    <span className={styles.value}>{stat.value}</span>
                </div>
            ))}

            {/* 🧠 Handle Pitch Retention separately */}
            <div className={styles.statItem}>
                <div className={styles.textDot}>
                    <span className={styles.label}>
                        Pitch Retention
                        <span className={styles.tooltipWrapper}>
                            <Info size={14} className={styles.tooltipIcon} />
                            <span className={styles.tooltipText}>{tooltips["Pitch Retention"]}</span>
                        </span>
                    </span>
                </div>

                {/* Check pitchTime from stats */}
                {(!pitchTime || pitchTime === "00:00") ? (
                    <button
                        className={styles.setPitchButton}
                        onClick={() => console.log("Set pitch clicked")}
                    >
                        Set Pitch Time
                    </button>
                ) : (
                    <span className={styles.value}>{`${pitchRetention?.toFixed(1) || 0}%`}</span>
                )}
            </div>
        </div>
    );

};

export default VideoStats;
