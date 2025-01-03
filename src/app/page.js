"use client"
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import styles from "./page.module.css"
import VideoPlayer from "@/app/video-player/VideoPlayer";
import CompanyMarquee from "@/app/components/CompanyMarquee";
import { useRouter } from "next/navigation";
import HeaderOutApp from "./components/headerOutApp";

const Page = () => {
    const router = useRouter();
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    const handleTryItNow = () => {
        router.push("/signin"); // Navigate to /signin
    };

  return (
      <div className="page">
          <HeaderOutApp/>
          <div className={styles.container}>
              <div className={styles.eyebrow}>
                  <p className={styles.eyebrowText}>Keep Them Watching</p>
                  <div className={styles.eyebrowUnderline}></div>
              </div>

              <motion.h1
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeInUp}
                  transition={{ duration: 0.8 }}
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
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeInUp}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={styles.subtitles}
              >
                  Use a smart progress bar to keep viewers watching longer and turn more views into sales.
                  <span className={styles.break}>
                        <br />
                    </span>

              </motion.p>

              <iframe
                  src="http://localhost:3000/embed/676fd3ffc0b98aad3aee39fa"
                  style={{border: "none", width: "100%", height: "500px"}}
                  allow="autoplay; fullscreen"
                  allowFullScreen>
              </iframe>

              <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeInUp}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className={styles.bookCall}
                  onClick={handleTryItNow}
              >
                  <p>Try It Now</p>
              </motion.div>
          </div>
          <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              transition={{ duration: 0.8 }}
          >
              <CompanyMarquee />
          </motion.div>
      </div>
  );
}


export default Page;