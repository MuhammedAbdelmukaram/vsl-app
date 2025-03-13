import React from 'react';
import styles from "@/app/video/[id]/video.module.css";

const Start = ({ video, handleChange, uploadedThumbnailUrl, handleThumbnailChange }) => {
    const allowedOptions = ["showThumbnail", "autoPlay"];

    const handleOptionChange = (e) => {
        const { name, checked } = e.target;

        // Allow both to be deselected, but only one can be selected at a time
        const updatedOptions = {
            autoPlay: name === "autoPlay" ? checked : false,
            showThumbnail: name === "showThumbnail" ? checked : false
        };

        // If deselecting, maintain existing selections
        if (!checked) {
            updatedOptions.autoPlay = video.options.autoPlay && name !== "autoPlay";
            updatedOptions.showThumbnail = video.options.showThumbnail && name !== "showThumbnail";
        }

        handleChange({ target: { name: "options", value: updatedOptions } });
    };

    return (
        <div className={styles.optionsGrid}>
            <div className={styles.optionsGrid}>
                {allowedOptions.map((key) => (
                    <div key={key} className={styles.option}>
                        <input
                            type="checkbox"
                            id={key}
                            name={key}
                            checked={video.options[key] || false}
                            onChange={handleOptionChange}
                            disabled={key === "showThumbnail" && (!uploadedThumbnailUrl || uploadedThumbnailUrl==="/default-thumbnail.jpg")} // Disable if no thumbnail is available
                        />
                        <label htmlFor={key} className={!uploadedThumbnailUrl && key === "showThumbnail" ? styles.disabledLabel : ""}>
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </label>
                    </div>
                ))}
            </div>
            <div className={styles.inputGroup}>
                <small>Auto-Play Text</small>
                <input
                    type="text"
                    name="autoPlayText"
                    value={video.autoPlayText || ""}
                    onChange={handleChange}
                    placeholder="Auto-play overlay text"
                />
            </div>
            <div className={styles.thumbnailImages}>
                <p>Thumbnail</p>
                <div className={styles.thumbnailWrapper}>
                    <label className={styles.specialLabel} htmlFor="thumbnail-upload">
                        <img
                            src={uploadedThumbnailUrl || "/default-thumbnail.jpg"}
                            alt="Thumbnail"
                            className={styles.thumbnailImage}
                        />
                    </label>
                    <input
                        type="file"
                        id="thumbnail-upload"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => handleThumbnailChange(e, "thumbnail")}
                    />
                </div>
            </div>
        </div>
    );
};

export default Start;
