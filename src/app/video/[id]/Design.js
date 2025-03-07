import React from 'react';
import styles from "@/app/video/[id]/video.module.css";

const Design = ({handlePitchTimeChange, video, handleChange}) => {

    const allowedOptions = ["border", "borderGlow"];


    return (
        <div>
            <div className={styles.optionsGrid}>
                {Object.entries(video.options)
                    .filter(([key]) => allowedOptions.includes(key)) // Only include specified options
                    .map(([key, value]) => (
                        <div key={key} className={styles.option}>
                            {key === "playbackRate" ? (
                                <input
                                    type="number"
                                    id={key}
                                    name={key}
                                    value={value}
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    onChange={handleChange}
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    id={key}
                                    name={key}
                                    checked={value}
                                    onChange={handleChange}
                                />
                            )}
                            <label htmlFor={key}>
                                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                            </label>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Design;