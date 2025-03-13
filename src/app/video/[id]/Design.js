import React from 'react';
import styles from "@/app/video/[id]/video.module.css";
import ColorPicker from "@/app/components/colorPicker";

const Design = ({handlePitchTimeChange, video, handleChange, handleBorderRadiusChange, setVideo, setBorderWidth}) => {

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

                <div className={styles.inputGroup}>
                    <small>Progress Bar Color</small>
                    <ColorPicker
                        color={video.brandColor || "#ffffff"}
                        onChange={(color) =>
                            setVideo((prev) => ({
                                ...prev,
                                brandColor: color,
                            }))
                        }
                    />
                </div>


                {/* Always Visible but Disabled When Border is Off */}
                <div className={styles.inputGroup}>
                    <small>Border Width</small>
                    <div className={styles.borderWidthGroup}>
                        {["1px", "2px", "3px"].map((width) => (
                            <button
                                key={width}
                                className={`${styles.borderWidthButton} ${
                                    (video.options.borderWidth || "1px") === width ? styles.activeButton : ""
                                } ${!video.options.border ? styles.disabledButton : ""}`}
                                onClick={() => setBorderWidth(width)}
                                disabled={!video.options.border}
                            >
                                {width}
                            </button>
                        ))}
                    </div>
                </div>


                <div className={styles.rangeWrapper}>
                    <small>Border Radius</small>
                    <div className={styles.sliderThing}>
                        <input
                            type="range"
                            min="0"
                            max="12"
                            step="1"
                            value={parseInt(video.options.borderRadius) || 1}
                            onChange={handleBorderRadiusChange}
                            className={!video.options.border ? styles.disabledInput : styles.rangeInput}
                        />
                        <div className={styles.borderWidthGroup}>
                            <span className={styles.borderWidthButton}>{video.options.borderRadius || "0px"}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <small>Border Glow Color</small>
                    <ColorPicker
                        disabled={!video.options.borderGlow}
                        color={video.options.borderGlowColor || "#ff0000"}
                        onChange={(color) => setVideo((prev) => ({
                            ...prev,
                            options: {...prev.options, borderGlowColor: color},
                        }))}
                    />
                </div>


                <div className={styles.inputGroup}>
                    <small>Border Color</small>
                    <ColorPicker
                        color={video.options.borderColor || "#ffffff"}
                        onChange={(color) =>
                            setVideo((prev) => ({
                                ...prev,
                                options: {...prev.options, borderColor: color},
                            }))
                        }
                        disabled={!video.options.border}
                        className={!video.options.border ? styles.disabledInput : ""}
                    />
                </div>



            </div>
        </div>
    );
};

export default Design;