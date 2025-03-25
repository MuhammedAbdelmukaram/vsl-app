import styles from "./ToolsSection.module.css";
import Image from "next/image";
import React, { useState } from "react";

const ToolsSection = () => {
    // State to track selected feature
    const [activeFeature, setActiveFeature] = useState("progress-bar");

    // Feature data mapping
    const featureData = {
        "progress-bar": {
            image: "/placeholderA.png",
            title: "Boosts retention & completion rates",
            description: "Allows users to pick up where they left off or rewatch, increasing overall engagement."
        },
        "auto-play": {
            image: "/placeholderA.png",
            title: "Auto-Play Feature",
            description: "Automatically starts playback, increasing play rate by removing friction."
        },
        "exit-thumbnail": {
            image: "/placeholderA.png",
            title: "Exit Thumbnail",
            description: "Grabs attention when users hover away, bringing them back into the experience."
        },
        "ab-testing": {
            image: "/placeholderA.png",
            title: "A/B Testing",
            description: "Optimize your videos with controlled experiments to maximize conversions."
        },
        "resume-replay": {
            image: "/placeholderA.png",
            title: "Resume/Replay",
            description: "Lets users resume where they left off, improving completion rates."
        }
    };

    return (
        <section className={styles.toolsSection}>
            <h4 className={styles.optimizedText}>OPTIMIZED FOR FUNNELS</h4>
            <h2 className={styles.mainTitle}>Tools That Boost Sales</h2>
            <p className={styles.subtitle}>
                We made sure not to leave anyone’s profits hanging, just because they chose the wrong platform ;)
            </p>

            <div className={styles.contentWrapper}>
                {/* Feature Buttons */}
                <div className={styles.features}>
                    {[
                        { id: "progress-bar", icon: "/f1.svg", text: "SMART PROGRESS BAR", badge: "+44% Retention" },
                        { id: "auto-play", icon: "/f2.svg", text: "AUTO-PLAY", badge: "+12% Play Rate" },
                        { id: "exit-thumbnail", icon: "/f3.svg", text: "EXIT THUMBNAIL" },
                        { id: "ab-testing", icon: "/f4.svg", text: "A/B TESTING" },
                        { id: "resume-replay", icon: "/f5.svg", text: "RESUME/REPLAY" },
                        { id: "resume-replay", icon: "/f5.svg", text: "RESUME/REPLAY" }
                    ].map(({ id, icon, text, badge }) => (
                        <button
                            key={id}
                            className={`${styles.featureButton} ${activeFeature === id ? styles.active : ""}`}
                            onClick={() => setActiveFeature(id)}
                        >
                            <Image src={icon} alt={text} width={50} height={50} className={styles.logo} />
                            <div className={styles.featureTextWrapper}>
                                {text}
                                {badge && <span className={styles.badge}>{badge}</span>}
                            </div>
                        </button>

                    ))}
                    <a className={styles.moreFeatures} href="#">+10 more features</a>
                </div>

                {/* Video Placeholder (Now an Image) */}
                <div className={styles.videoSection}>
                    <Image
                        src={featureData[activeFeature].image}
                        alt="Feature Preview"
                        width={600}
                        height={350}
                        className={styles.videoPlaceholder}
                    />
                    <h3 className={styles.videoTitle}>{featureData[activeFeature].title}</h3>
                    <p className={styles.videoDescription}>{featureData[activeFeature].description}</p>
                </div>
            </div>

            {/* Growth Playbook Section
            <div className={styles.growthPlaybook}>
                <h3>Growth Playbook</h3>
                <p>Proven techniques to maximize watch time and action rates</p>
                <div className={styles.cards}>
                    {[1, 2, 3, 4].map((_, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.cardImage}></div>
                            <p className={styles.cardText}>Leverage A/B test for your VSL</p>
                        </div>
                    ))}
                </div>
            </div>
            */}
        </section>
    );
};

export default ToolsSection;
