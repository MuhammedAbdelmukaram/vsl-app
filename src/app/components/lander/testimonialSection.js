"use client";
import { useState } from "react";
import styles from "./testimonialSection.module.css";
import UntrackedVideoPlayer from "@/app/untracked-video-player/UntrackedVideoPlayer";
import Marquee from "react-fast-marquee";

const TestimonialSection = () => {
    const [isPaused, setIsPaused] = useState(false);

    return (
        <section className={styles.testimonialSection}>
            <h2 className={styles.subtitle}>WHAT OTHERS SAY?</h2>
            <h1 className={styles.title}>Don’t take our word. Take theirs!</h1>

            {/* Marquee that stops on hover */}
            <Marquee gradient={false} speed={50} play={!isPaused} style={{ display: "flex" }}>
                <div
                    className={styles.imageContainer}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <UntrackedVideoPlayer />
                    <UntrackedVideoPlayer />
                    <UntrackedVideoPlayer />
                    <UntrackedVideoPlayer />
                    <UntrackedVideoPlayer />
                </div>
            </Marquee>

            <div className={styles.testimonialsDesktop}>
                {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className={styles.card}>
                        <div className={styles.top}>
                            <p className={styles.role}>MARKETER</p>
                            <p className={styles.date}>7 days ago</p>
                        </div>
                        <p className={styles.text}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                        <div className={styles.profile}>
                            <div className={styles.avatar}></div>
                            <div>
                                <p className={styles.name}>Maria Reed, Alex Backer</p>
                                <p className={styles.company}>CEO of TikTok, CTO of Facebook</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile-only Marquee for testimonials */}
            <div className={styles.testimonialsMobile}>
                <Marquee
                    gradient={false}
                    speed={30}
                    direction="right"
                    pauseOnHover={true}
                >
                    {[1, 2, 3, 4].map((_, index) => (
                        <div key={index} className={styles.cardMobile}>
                            <div className={styles.top}>
                                <p className={styles.role}>MARKETER</p>
                                <p className={styles.date}>7 days ago</p>
                            </div>
                            <p className={styles.text}>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </p>
                            <div className={styles.profile}>
                                <div className={styles.avatar}></div>
                                <div>
                                    <p className={styles.name}>Maria Reed, Alex Backer</p>
                                    <p className={styles.company}>CEO of TikTok, CTO of Facebook</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Marquee>
            </div>

            <p className={styles.footerText}>Over 500+ Happy Users</p>
        </section>
    );
};

export default TestimonialSection;
