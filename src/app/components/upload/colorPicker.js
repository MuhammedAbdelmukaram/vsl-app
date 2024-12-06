import React, { useState } from "react";
import styles from "./colorPicker.module.css";

const ColorPicker = () => {
    const [color, setColor] = useState("#6B45C1");

    const handleColorChange = (e) => {
        setColor(e.target.value);
    };

    return (
        <div className={styles.colorPickerContainer}>
            <input
                type="color"
                value={color}
                onChange={handleColorChange}
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
