import React, { useState, useRef, useEffect } from "react";
import styles from "./upload/colorPicker.module.css";

const ColorPicker = ({ color="#ffffff", onChange, disabled }) => {
    const [hexValue, setHexValue] = useState(color.toUpperCase());
    const inputRef = useRef(null); // Reference to hidden color input

    // Sync text input when color changes externally
    useEffect(() => {
        setHexValue(color.toUpperCase());
    }, [color]);

    // Handle color picker change
    const handleColorChange = (e) => {
        const newColor = e.target.value.toUpperCase();
        setHexValue(newColor);
        onChange(newColor);
    };

    // Handle manual text input
    const handleTextChange = (e) => {
        let newHex = e.target.value.toUpperCase();
        if (!newHex.startsWith("#")) {
            newHex = `#${newHex}`;
        }
        setHexValue(newHex);
        if (/^#([0-9A-F]{6})$/i.test(newHex)) {
            onChange(newHex);
        }
    };

    // Click the hidden color input when the button is clicked
    const openColorPicker = () => {
        inputRef.current.click();
    };

    return (
        <div className={styles.colorPickerContainer}>
            {/* Hidden Color Input */}
            <input
                type="color"
                value={color}
                onChange={handleColorChange}
                disabled={disabled}
                ref={inputRef}
                className={disabled ? styles.disabledInput :styles.hiddenColorInput}
            />

            {/* Custom Color Display Button */}
            <button
                style={{ backgroundColor: color }}
                onClick={openColorPicker}
                className={disabled ? styles.disabledColor :styles.colorButton}
            >
                &nbsp;
            </button>

            {/* Hex Code Input */}
            <input
                type="text"
                value={hexValue}
                onChange={handleTextChange}
                className={styles.colorHexInput}
            />
        </div>
    );
};

export default ColorPicker;
