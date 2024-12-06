"use client"
import React from 'react';
import Layout from '../components/LayoutHS'; // Assuming LayoutHS is your header/sidebar layout component
import styles from './video.module.css';
import ColorPicker from "@/app/components/upload/colorPicker";

const Page = () => {
    return (
        <Layout>
            <div className={styles.pageContainer}>
                {/* Upper Section */}
                <div className={styles.upperSection}>
                    <div className={styles.videoDetails}>
                        <div style={{width: "fit-content"}}>
                            <div className={styles.videoInfo}>
                                <h2>Master Thumbnail Design</h2>
                                <p>12.4.2024</p>
                            </div>
                            <div className={styles.videoThumbnail}>
                                <img src="/videoThumbnail.png" alt="Video Thumbnail"/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.optionsSection}>
                        <h3>Options</h3>
                        <div className={styles.optionsSection}>
                            <div className={styles.option}>
                                <div className={styles.checkboxWrapper}>
                                    <input type="checkbox" id="fastProgress"/>
                                </div>
                                <label htmlFor="fastProgress" className={styles.label}>
                                    Fast Progress Bar <span>(recommended)</span>
                                    <div className={styles.customInfoIcon}>i</div>
                                </label>
                            </div>
                            <div className={styles.option}>
                                <div className={styles.checkboxWrapper}>
                                    <input type="checkbox" id="autoPlay"/>
                                </div>
                                <label htmlFor="autoPlay" className={styles.label}>
                                    Auto-Play
                                    <div className={styles.customInfoIcon}>i</div>
                                </label>
                            </div>
                            <div className={styles.option}>
                                <div className={styles.checkboxWrapper}>
                                    <input type="checkbox" id="laterCta"/>
                                </div>
                                <label htmlFor="laterCta" className={styles.label}>
                                    Later CTA
                                    <div className={styles.customInfoIcon}>i</div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.thumbnails}>

                        <div className={styles.thumbnailImages}>
                            <div className={styles.thumbnailWrapper}>
                                <p>Thumbnail</p>
                                <img src="/videoThumbnail.png" alt="Thumbnail"/>
                            </div>

                            <div className={styles.thumbnailWrapper}>
                                <p>Thumbnail</p>
                                <img src="/videoThumbnail.png" alt="Thumbnail"/>
                            </div>
                        </div>
                    </div>
                    <button className={styles.saveButton}>Save</button>
                </div>

                {/* Middle Section */}
                <div className={styles.middleSection}>
                    <div className={styles.inputs}>
                        <div className={styles.inputGroup}>
                            <label>Pitch Time</label>
                            <div className={styles.timeInputs}>
                                <input type="number" placeholder="Minute"/>
                                <input type="number" placeholder="Second"/>
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>CTA Text</label>
                            <input type="text" placeholder="Get Your Stuff Now!"/>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Auto-Play Text</label>
                            <input type="text" placeholder="This video has already started. Click to Listen!"/>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Brand Color</label>
                            <ColorPicker />
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={styles.bottomSection}>
                    <div className={styles.tabs}>
                        <button className={styles.activeTab}>General</button>
                        <button>Retention</button>
                        <button>Countries</button>
                        <button>Devices</button>
                        <button>Browser</button>
                        <button>Traffic Source</button>
                    </div>
                    <div className={styles.analyticsGrid}>
                        {Array(6).fill().map((_, index) => (
                            <div className={styles.analyticsCard} key={index}>
                                <h4>Total Views</h4>
                                <p>435</p>
                                <div className={styles.chart}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Page;
