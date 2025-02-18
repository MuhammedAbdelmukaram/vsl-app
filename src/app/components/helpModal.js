"use client";

import React from "react";
import Image from "next/image";
import styles from "./HelpModal.module.css";

const helpOptions = [
    { img: "/supportIcons/4.png", title: "How To Add My VSL", subtitle: "Watch Tutorial", action: () => alert("Watch Tutorial") },
    { img: "/supportIcons/5.png", title: "FAQs", subtitle: "Most Common Cases", action: () => alert("FAQs") },
    { img: "/supportIcons/6.png", title: "Contact Support", subtitle: "Available 24/7", action: () => alert("Contact Support") },
];

const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>Need Help?</h3>
                <div className={styles.xButton} onClick={onClose}>
                    <Image src="/closeIcon.png" height={20} width={20} alt={"closeIcon"}/>
                </div>
                <div className={styles.helpGrid}>
                    {helpOptions.map((option, index) => (
                        <div key={index} className={styles.helpBox} onClick={option.action}>
                            <Image src={option.img} alt={option.title} width={160} height={160} />
                            <h4>{option.title}</h4>
                            <p>{option.subtitle}</p>
                        </div>
                    ))}
                </div>

                <div className={styles.buttonLayer}>
                    <button className={styles.metric} onClick={onClose}>Close</button>
                </div>

            </div>
        </div>
    );
};

export default HelpModal;
