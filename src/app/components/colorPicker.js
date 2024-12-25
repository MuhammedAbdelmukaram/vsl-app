import React from "react";
import styles from "./upload/colorPicker.module.css";

const ColorPicker = ({ color, onChange }) => {
    return (
        <div className={styles.colorPickerContainer}>
            <input
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className={styles.colorInput}
            />
            <input
                type="text"
                value={color.toUpperCase()}
                readOnly
                className={styles.colorHexInput}
            />
        </div>
    );
};

export default ColorPicker;
