import React from "react";
import styles from "./Devices.module.css";
import { FaMobileAlt, FaDesktop, FaTabletAlt, FaTv, FaQuestion } from "react-icons/fa";

const devicesData = [
    { name: "Mobile", count: 520, icon: <FaMobileAlt className={styles.icon} /> },
    { name: "Desktop", count: 345, icon: <FaDesktop className={styles.icon} /> },
    { name: "Tablet", count: 78, icon: <FaTabletAlt className={styles.icon} /> },
    { name: "Smart TV", count: 12, icon: <FaTv className={styles.icon} /> },
    { name: "Other", count: 5, icon: <FaQuestion className={styles.icon} /> },
];

const Devices = () => {
    const sortedDevices = [...devicesData].sort((a, b) => b.count - a.count);

    // Split devices into columns
    const columns = [];
    const devicesPerColumn = 3;

    for (let i = 0; i < sortedDevices.length; i += devicesPerColumn) {
        columns.push(sortedDevices.slice(i, i + devicesPerColumn));
    }

    return (
        <div className={styles.container}>
            {columns.map((column, columnIndex) => (
                <div className={styles.column} key={columnIndex}>
                    {column.map((device, index) => (
                        <div className={styles.row} key={index}>
                            <div className={styles.leftSide}>
                                <div className={styles.rank}>
                                    {devicesPerColumn * columnIndex + index + 1}.
                                </div>
                                <div className={styles.iconWrapper}>{device.icon}</div>
                                <div className={styles.name}>
                                    <p>{device.name}</p>
                                </div>
                            </div>
                            <div className={styles.count}>{device.count}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Devices;
