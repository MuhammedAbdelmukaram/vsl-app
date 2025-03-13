export const selectStyles = {
    control: (baseStyles, state) => ({
        ...baseStyles,
        backgroundColor: "#131313",
        cursor: "pointer",
        padding: "8px 0px",
        color: "#fff",
        borderColor: state.isFocused ? "#dcdcdc" : "#606060",
        boxShadow: state.isFocused ? "0 0 0 1px #606060" : "none",
        outline: "none",
        "&:hover": {
            backgroundColor: "#262626",
            color: "#fff",
        },
    }),

    option: (provided, state) => ({
        ...provided,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 12px",
        cursor: "pointer", // Make sure cursor is always a pointer
        transition: "background 0.2s ease-in-out",
        backgroundColor: state.isFocused ? "#555" : "#242424", // Brighter hover effect
        color: state.isFocused ? "#fff" : "#ccc", // Slight color change
        borderRadius: "5px", // Rounded effect on hover
        "&:hover": {
            backgroundColor: "#666", // Even brighter hover effect
            color: "#fff",
        },
        "&:active": {
            backgroundColor: "#444", // Keep background when clicked
            color: "#fff",
        },
    }),

    menu: (provided) => ({
        ...provided,
        backgroundColor: "#242424",
        padding: 0,
        border: "1px solid #606060",
        borderRadius: "8px", // Smooth edges
    }),

    menuList: (provided) => ({
        ...provided,
        padding: "5px",
    }),

    singleValue: (provided) => ({
        ...provided,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#fff",
    }),

    input: (provided) => ({
        ...provided,
        width: "1px",
        opacity: 0,
        position: "absolute",
    }),
};
