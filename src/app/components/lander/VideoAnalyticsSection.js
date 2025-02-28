import styles from "./VideoAnalyticsSection.module.css";
import Image from "next/image";

const VideoAnalyticsSection = () => {
    return (
        <section className={styles.container}>
            <h2 className={styles.title}>Smart Video Analytics</h2>
            <p className={styles.subtitle}>We segment it so you know exactly what is going on</p>

            <div className={styles.content}>
                <div className={styles.features}>
                    <div className={styles.feature}>
                        <Image src="/d1.svg" alt="Partner 1" width={55} height={55} className={styles.logo}/>
                        <div>
                            <h3 className={styles.featureTitle} style={{color: "#ff7b00"}}>
                                Full Performance Overview
                            </h3>
                            <p className={styles.featureDescription} style={{color: "#ff7b00"}}>
                                Allows users to pick up where they left off or rewatch, increasing overall engagement.
                            </p>
                        </div>
                    </div>

                    <div className={styles.feature}>
                        <Image src="/d2.svg" alt="Partner 1" width={55} height={55} className={styles.logo}/>
                        <div>
                            <h3 className={styles.featureTitle}>Retention Graph</h3>
                            <p className={styles.featureDescription}>
                                Allows users to pick up where they left off or rewatch, increasing overall engagement.
                            </p>
                        </div>
                    </div>

                    <div className={styles.feature}>
                        <Image src="/d3.svg" alt="Partner 1" width={55} height={55} className={styles.logo}/>
                        <div>
                            <h3 className={styles.featureTitle}>Audience Segmentation</h3>
                            <p className={styles.featureDescription}>
                                Allows users to pick up where they left off or rewatch, increasing overall engagement.
                            </p>
                        </div>
                    </div>

                    <div className={styles.feature}>
                        <Image src="/d4.svg" alt="Partner 1" width={55} height={55} className={styles.logo}/>
                        <div>
                            <h3 className={styles.featureTitle}>Drop-Off Alerts</h3>
                            <p className={styles.featureDescription}>
                                Allows users to pick up where they left off or rewatch, increasing overall engagement.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.videoPlaceholder}></div>
            </div>

            <div className={styles.quoteSection}>
                <div className={styles.quoteBox}></div>
                <div>


                    <p className={styles.quote}>
                        <span className={styles.bold}>“ See Your Audience </span>Allows users to pick up where they left
                        off or rewatch, increasing overall engagement. “
                    </p>
                    <p className={styles.author}>Alex Backer <span className={styles.position}>CEO of TikTok, CTO of Facebook</span>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default VideoAnalyticsSection;
