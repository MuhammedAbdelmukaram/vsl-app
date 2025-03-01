"use client"
import {motion} from "framer-motion";
import Typewriter from "typewriter-effect";
import styles from "./page.module.css"
import CompanyMarquee from "@/app/components/CompanyMarquee";
import {useRouter} from "next/navigation";
import HeaderOutApp from "./components/headerOutApp";
import Script from "next/script";
import VideoPlayer from "@/app/video-player/VideoPlayer";
import UntrackedVideoPlayer from "@/app/untracked-video-player/UntrackedVideoPlayer";
import Image from "next/image";
import React from "react";
import Science from "@/app/components/lander/Science";
import TestimonialSection from "@/app/components/lander/testimonialSection";
import StepsSection from "@/app/components/lander/StepsSection";
import VideoAnalyticsSection from "@/app/components/lander/VideoAnalyticsSection";
import ToolsSection from "@/app/components/lander/ToolsSection";
import Integrations from "@/app/components/lander/Integrations";
import Footer from "@/app/components/lander/Footer";
import QuoteSection from "@/app/components/lander/QuoteSection";

const Page = () => {
    const router = useRouter();
    const fadeInUp = {
        hidden: {opacity: 0, y: 20},
        visible: {opacity: 1, y: 0},
    };
    const handleTryItNow = () => {
        router.push("/signin"); // Navigate to /signin
    };

    return (
        <div className={styles.page}>
            <div className={styles.headerHelper}>
                <HeaderOutApp/>
            </div>
            <div className={styles.container}>

                <div className={styles.gradient}>
                    <Image
                        src="/gradient.svg"
                        alt="Partner 4"
                        width={1200}
                        height={1200}
                        className={styles.logo}
                    />
                </div>

                <div className={styles.gradient2}>
                    <Image
                        src="/gradient.svg"
                        alt="Partner 4"
                        width={1200}
                        height={1200}
                        className={styles.logo}
                    />
                </div>

                <div className={styles.gradient3}>
                    <Image
                        src="/gradient.svg"
                        alt="Partner 4"
                        width={1200}
                        height={1200}
                        className={styles.logo}
                    />
                </div>

                <div className={styles.gradient4}>
                    <Image
                        src="/gradient.svg"
                        alt="Partner 4"
                        width={1200}
                        height={1200}
                        className={styles.logo}
                    />
                </div>

                <div className={styles.gradient5}>
                    <Image
                        src="/gradient.svg"
                        alt="Partner 4"
                        width={1200}
                        height={1200}
                        className={styles.logo}
                    />
                </div>

                <div className={styles.gradient6}>
                    <Image
                        src="/gradient.svg"
                        alt="Partner 4"
                        width={1200}
                        height={1200}
                        className={styles.logo}
                    />
                </div>

                <div className={styles.gradient7}>
                    <Image
                        src="/gradient.svg"
                        alt="Partner 4"
                        width={1200}
                        height={1200}
                        className={styles.logo}
                    />
                </div>

                <div className={styles.gradient8}>
                    <Image
                        src="/gradient.svg"
                        alt="Partner 4"
                        width={1200}
                        height={1200}
                        className={styles.logo}
                    />
                </div>

                <div className={styles.gradient9}>
                    <Image
                        src="/gradient.svg"
                        alt="Partner 4"
                        width={1200}
                        height={1200}
                        className={styles.logo}
                    />
                </div>

                <div className={styles.gradient10}>
                    <Image
                        src="/gradient.svg"
                        alt="Partner 4"
                        width={1200}
                        height={1200}
                        className={styles.logo}
                    />
                </div>



                <div className={styles.topside}>
                    <div className={styles.leftSide}>


                        {/*<div className={styles.eyebrow}>
                            <p className={styles.eyebrowText}>Keep Them Watching</p>
                            <div className={styles.eyebrowUnderline}></div>
                        </div>*/}

                        <motion.h1
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true, amount: 0.3}}
                            variants={fadeInUp}
                            transition={{duration: 0.6}}
                            className={styles.heading}
                        >
                            <Typewriter
                                options={{
                                    autoStart: true,
                                    loop: false,
                                    delay: 35,
                                }}
                                onInit={(typewriter) => {
                                    typewriter
                                        .typeString("Increase VSL Conversions  23% ")
                                        .pauseFor(250)
                                        .typeString(' <span style="color: #d45900;">By switching your video player </span>')
                                        .start();
                                }}
                            />
                        </motion.h1>
                        <motion.p
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true, amount: 0.3}}
                            variants={fadeInUp}
                            transition={{duration: 0.8, delay: 0.2}}
                            className={styles.subtitles}
                        >
                            We made a video player designed to increase watch time and drive more sales that
                            integrates on any website. Make your VSL feel shorter and sell more.
                            <span className={styles.break}>
                        <br/>
                    </span>

                        </motion.p>
                        <div className={styles.boxes}>
                            <div className={styles.box}>
                                <Image src="/Hero1.png" alt="Clock Icon" width={72} height={72}
                                       className={styles.boxImg}/>
                                <p className={styles.boxText}>Smart Progress Bar</p>
                            </div>
                            <div className={styles.box}>
                                <Image src="/Hero2.png" alt="Clock Icon" width={72} height={72}
                                       className={styles.boxImg}/>
                                <p className={styles.boxText}>Auto-Play</p>
                            </div>
                            <div className={styles.box}>
                                <Image src="/Hero3.png" alt="Clock Icon" width={72} height={72}
                                       className={styles.boxImg}/>
                                <p className={styles.boxText}>Exit Thumbnails</p>
                            </div>
                            <div className={styles.arrowContainer}>
                                <div className={styles.arrow}></div>
                            </div>
                            <div className={styles.textsRight}>
                                <p className={styles.featuresOrange}>+10 more features</p>
                                <p className={styles.italic}>Made to increase <br/>conversions</p>
                            </div>
                        </div>


                    </div>
                    {/* Load the external script */}
                    <div className={styles.outer}>

                        <div className={styles.glowingBorder}>
                            <div
                                id="vid_676726228f714081916a35b3" // Must match `VIDEO_CONFIG.videoId`
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            ></div>
                            <Script
                                id="scr_video_player_676726228f714081916a35b3"
                                src="https://pub-c376537ae6c646e39fabf6d97ec84d7b.r2.dev/players/676726228f714081916a35b3/67554f799c85ed4fd8c891e2-676726228f714081916a35b3-player.bundle.js"
                                strategy="afterInteractive"
                            />
                        </div>
                    </div>

                </div>
                {/* <VideoPlayer
                  videoId={"676726228f714081916a35b3"}
                  exitThumbnail={"https://cdn.vslapp.pro/exit-thumbnails/67554f799c85ed4fd8c891e2-Team2.jpg"}
                  autoPlayText={"YAYA"}
                  fastProgressBar={true}
                  autoPlay={true}
                  showExitThumbnail={true}
                  showThumbnail={true}
                  url={"https://cdn.vslapp.pro/videos/67554f799c85ed4fd8c891e2-VSL.mp4"}
              />

              <UntrackedVideoPlayer
                  videoId={"676726228f714081916a35b3"}
                  exitThumbnail={"https://cdn.vslapp.pro/exit-thumbnails/67554f799c85ed4fd8c891e2-Team2.jpg"}
                  autoPlayText={"YAYA"}
                  fastProgressBar={true}
                  autoPlay={true}
                  showExitThumbnail={true}
                  showThumbnail={true}
                  url={"https://cdn.vslapp.pro/videos/67554f799c85ed4fd8c891e2-VSL.mp4"}
              />
                */}


                <div className={styles.relative}>


                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true, amount: 0.3}}
                        variants={fadeInUp}
                        transition={{duration: 0.8, delay: 0.4}}
                        className={styles.bookCall}
                        onClick={handleTryItNow}
                    >
                        <p>Try For Free</p>

                    </motion.div>
                    <Image
                        src="/arrow.svg"
                        alt="Partner 4"
                        width={120}
                        height={120}
                        className={styles.arrow2}
                    />
                </div>
                <div className={styles.checks}>
                    <p>✓ Cancel Anytime</p>
                    <p>✓ No Credit Card Required</p>
                    <p>✓ 14-Day Free Trial</p>
                </div>


            </div>
            <div className={styles.smallReview}>
                <div className={styles.person}>
                    <Image
                        src="/g1.jpg"
                        alt="Partner 4"
                        width={35}
                        height={35}

                    />
                </div>
                <div className={styles.person}>
                    <Image
                        src="/g2.jpg"
                        alt="Partner 4"
                        width={35}
                        height={35}
                        objectFit="cover"
                    />
                </div>
                <div className={styles.person}>
                    <Image
                        src="/g3.jpg"
                        alt="Partner 4"
                        width={35}
                        height={35}

                    />
                </div>
                <p className={styles.smallText}>Over 500 firms and 10,000+ Users Love It</p>


            </div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.3}}
                variants={fadeInUp}
                transition={{duration: 0.8}}
                className={styles.companies}
            >
                <CompanyMarquee/>
            </motion.div>

            <div className={styles.science}>
                <div className={styles.headline}>
                    <p className={styles.eyebrow2}>
                        BACKED BY SCIENCE
                    </p>
                    <h1 className={styles.heading2}>
                        How did <span style={{color: "#D45900"}}>we</span> do on 10,000 views?
                    </h1>

                </div>
                <Science/>
            </div>


            <TestimonialSection/>


            <ToolsSection/>
            <Integrations/>
            <VideoAnalyticsSection/>
            <QuoteSection/>
            <StepsSection/>

            <Footer/>


        </div>
    );
}


export default Page;