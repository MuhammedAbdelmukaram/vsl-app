import React from "react";
import styles from "./Countries.module.css";
import Flag from "react-world-flags";

const countriesData = [
    { name: "United Kingdom", code: "GB", count: 300 },
    { name: "USA", code: "US", count: 124 },
    { name: "Canada", code: "CA", count: 34 },
    { name: "Australia", code: "AU", count: 14 },
    { name: "New Zealand", code: "NZ", count: 14 },
    { name: "Germany", code: "DE", count: 25 },
    { name: "France", code: "FR", count: 22 },
    { name: "India", code: "IN", count: 19 },
    { name: "Brazil", code: "BR", count: 18 },
    { name: "South Africa", code: "ZA", count: 16 },
    { name: "Japan", code: "JP", count: 12 },
    { name: "China", code: "CN", count: 11 },
    { name: "Italy", code: "IT", count: 10 },
    { name: "Mexico", code: "MX", count: 9 },
    { name: "Spain", code: "ES", count: 8 },
];

const Countries = () => {
    const sortedCountries = [...countriesData].sort((a, b) => b.count - a.count);

    // Split countries into columns
    const columns = [];
    const countriesPerColumn = 5;

    for (let i = 0; i < sortedCountries.length; i += countriesPerColumn) {
        columns.push(sortedCountries.slice(i, i + countriesPerColumn));
    }

    return (
        <div className={styles.container}>
            {columns.map((column, columnIndex) => (
                <div className={styles.column} key={columnIndex}>
                    {column.map((country, index) => (
                        <div className={styles.row} key={country.code}>
                            <div className={styles.leftSide}>
                                <div className={styles.rank}>
                                    {countriesPerColumn * columnIndex + index + 1}.
                                </div>
                                <div className={styles.flagWrapper}>
                                    <Flag code={country.code} className={styles.flag} />
                                </div>
                                <div className={styles.name}>
                                    <p>{country.name}</p>
                                </div>
                            </div>
                            <div className={styles.count}>{country.count}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Countries;
