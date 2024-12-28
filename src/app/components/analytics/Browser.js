import React from "react";
import styles from "./Browser.module.css";
import { FaChrome, FaFirefoxBrowser, FaSafari, FaEdge, FaQuestion } from "react-icons/fa";

const browserData = [
    { name: "Chrome", count: 620, icon: <FaChrome className={styles.icon} /> },
    { name: "Firefox", count: 245, icon: <FaFirefoxBrowser className={styles.icon} /> },
    { name: "Safari", count: 180, icon: <FaSafari className={styles.icon} /> },
    { name: "Edge", count: 95, icon: <FaEdge className={styles.icon} /> },
    { name: "Other", count: 10, icon: <FaQuestion className={styles.icon} /> },
];

const Browser = () => {
    const sortedBrowsers = [...browserData].sort((a, b) => b.count - a.count);

    // Split browsers into columns
    const columns = [];
    const browsersPerColumn = 3;

    for (let i = 0; i < sortedBrowsers.length; i += browsersPerColumn) {
        columns.push(sortedBrowsers.slice(i, i + browsersPerColumn));
    }

    return (
        <div className={styles.container}>
            {columns.map((column, columnIndex) => (
                <div className={styles.column} key={columnIndex}>
                    {column.map((browser, index) => (
                        <div className={styles.row} key={index}>
                            <div className={styles.leftSide}>
                                <div className={styles.rank}>
                                    {browsersPerColumn * columnIndex + index + 1}.
                                </div>
                                <div className={styles.iconWrapper}>{browser.icon}</div>
                                <div className={styles.name}>
                                    <p>{browser.name}</p>
                                </div>
                            </div>
                            <div className={styles.count}>{browser.count}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Browser;
