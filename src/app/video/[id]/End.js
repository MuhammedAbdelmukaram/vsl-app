import React from 'react';
import styles from "@/app/video/[id]/video.module.css";

const End = ({video, handleChange, handleThumbnailChange, uploadedExitThumbnailUrl}) => {

    const allowedOptions = [ "exitThumbnailButtons" ,"showExitThumbnail",];


    return (
        <div className={styles.optionsGrid}>
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
                                    disabled={key === "showExitThumbnail" && (!uploadedExitThumbnailUrl || uploadedExitThumbnailUrl==="/default-thumbnail.jpg")} // Disable if no thumbnail is available
                                    onChange={handleChange}
                                />
                            )}
                            <label htmlFor={key}>
                                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                            </label>
                        </div>
                    ))}
            </div>

            <div className={styles.thumbnailImages}>
                <p>Exit Thumbnail</p>
                <div className={styles.thumbnailWrapper}>

                    <label className={styles.specialLabel} htmlFor="exit-thumbnail-upload">
                        <img
                            src={uploadedExitThumbnailUrl || "/default-thumbnail.jpg"}
                            alt="Exit Thumbnail"
                            className={styles.thumbnailImage}
                        />
                    </label>
                    <input
                        type="file"
                        id="exit-thumbnail-upload"
                        accept="image/*"
                        style={{display: "none"}} // Hide the input
                        onChange={(e) => handleThumbnailChange(e, "exitThumbnail")}
                    />
                </div>
            </div>
        </div>
    );
};

export default End;