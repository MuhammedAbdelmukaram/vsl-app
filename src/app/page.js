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
                <div className={styles.eyebrow}>
                    <p className={styles.eyebrowText}>Keep Them Watching</p>
                    <div className={styles.eyebrowUnderline}></div>
                </div>

                <motion.h1
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true, amount: 0.3}}
                    variants={fadeInUp}
                    transition={{duration: 0.8}}
                    className={styles.heading}
                >
                    <Typewriter
                        options={{
                            autoStart: true,
                            loop: false,
                            delay: 50,
                        }}
                        onInit={(typewriter) => {
                            typewriter
                                .typeString("Make Your VSL Feel Shorter and ")
                                .pauseFor(300)
                                .typeString('<br />Maximize <span style="color: #d45900;">Conversions </span>')
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
                    Use a smart progress bar to keep viewers watching longer and turn more views into sales.
                    <span className={styles.break}>
                        <br/>
                    </span>

                </motion.p>


                {/* Load the external script */}
                <div>

                </div>

                <div
                    id="vid_676726228f714081916a35b3" // Must match `VIDEO_CONFIG.videoId`
                    style={{
                        position: "relative",
                        width: "100%",
                    }}
                ></div>
                <Script
                    id="scr_video_player_676726228f714081916a35b3"
                    src="https://pub-c376537ae6c646e39fabf6d97ec84d7b.r2.dev/players/676726228f714081916a35b3/67554f799c85ed4fd8c891e2-676726228f714081916a35b3-player.bundle.js"
                    strategy="afterInteractive"
                />


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


                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true, amount: 0.3}}
                    variants={fadeInUp}
                    transition={{duration: 0.8, delay: 0.4}}
                    className={styles.bookCall}
                    onClick={handleTryItNow}
                >
                    <p>Try It Now</p>
                </motion.div>
            </div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{once: true, amount: 0.3}}
                variants={fadeInUp}
                transition={{duration: 0.8}}
            >
                <CompanyMarquee/>
            </motion.div>
        </div>
    );
}


export default Page;