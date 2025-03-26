import React from 'react';
import styles from "./Science.module.css"
import Image from "next/image";
import {motion} from "framer-motion";
const Science = () => {
    const fadeInUp = {
        hidden: {opacity: 0, y: 20},
        visible: {opacity: 1, y: 0},
    };
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, amount: 0.3}}
            variants={fadeInUp}
            transition={{duration: 0.8}}
            className={styles.companies}
        >


            <div className={styles.layout}>

                <div className={styles.containerSmall}>
                    <h2 className={styles.heading}>
                        <span className={styles.percentage}>30%</span> Play Rate Increase
                    </h2>

                    <div className={styles.separator}>

                    </div>

                    <div className={styles.content}>
                        {/* VSL Player Section */}
                        <div className={styles.row}>
                            <div className={styles.section}>
                                <img src="/me.svg" alt="VSL Player" className={styles.icon}/>
                                <span className={styles.subtext}>VSL Player</span>
                            </div>

                            <div>
                                <Image src="/peopleAll.svg" alt="Clock Icon" width={436} height={40}
                                       className={styles.logo} style={{ colorScheme: 'light' }}/>
                            </div>
                        </div>

                        {/* Industry Average Section */}
                        <div className={styles.row}>
                            <div className={styles.section}>
                                <img src="/competitors.svg" alt="Industry Average" className={styles.icon}/>
                                <span className={styles.subtext}>
                            Industry average <span
                                    className={styles.parenthesis}>(Youtube, Vimeo, Wistia, DailyMotion)</span>
                        </span>
                            </div>

                            <div>
                                <Image src="/peopleSome.svg" alt="Clock Icon" width={436} height={40}
                                       className={styles.logo} style={{ colorScheme: 'light' }}/>
                            </div>

                        </div>
                        {/* People Infographic (Assumed as an Image) */}

                        <div className={styles.separator}>

                        </div>
                        {/* Bottom Text */}
                        <p className={styles.description}>
                            In 10 website visitors, VSL Player will have 3 more plays in average compared to
                            competition,
                            consistently
                        </p>
                    </div>
                </div>


                <div className={styles.container}>
                    <h2 className={styles.heading}>
                        <span className={styles.percentage}>47%</span> Average Retention Increase
                    </h2>

                    {/* Separator Line */}

                    <div className={styles.separator}></div>
                    {/* Video Retention Comparison */}
                    <div className={styles.content}>
                        <div className={styles.row}>
                            {/* VSL Player */}
                            <div className={styles.section}>
                                <Image src="/competitors2.svg" alt="VSL Player" width={504} height={107}/>
                            </div>
                        </div>
                    </div>

                    {/* Separator Line */}
                    <div className={styles.separator}></div>

                    {/* Bottom Text */}
                    <p className={styles.description}>
                        Features like smart progress bar increased overall retention.
                    </p>
                </div>

                <div className={styles.container2}>
                    {/* Title Section */}
                    <h2 className={styles.headingSpecial}>
                        <span className={styles.percentageSpecial}>19%</span> MORE CONVERSIONS
                    </h2>

                    {/* Content Section */}
                    <div className={styles.content}>
                        {/* Left Side - Competitor Icon */}


                        {/* Right Side - VSL Player Icon */}
                        <div className={styles.section}>
                            <Image src="/competitors4.svg" alt="CTA Comparison Graphic" width={600} height={280}/>
                        </div>
                    </div>

                    {/* Explanation Text */}
                    <p className={styles.explanation}>
                        On your average 10 visitors, 3 more will play the video when using VSL Player. We figure, if
                        users don’t watch, they don’t buy.
                    </p>
                </div>

                <div className={styles.container}>
                    <h2 className={styles.heading}>
                        <span className={styles.percentage}>24%</span> Average CTA Clicks
                    </h2>

                    {/* Separator Line */}
                    <div className={styles.separator}></div>


                    {/* Below the line Image (Assuming Image below is part of the graphic) */}
                    <div className={styles.bottomImage}>
                        <Image src="/competitors3.svg" alt="CTA Comparison Graphic" width={400} height={280}/>
                    </div>
                </div>







                {/*SMALL SCREEN*/}



                <div className={styles.container3}>
                    {/* Title Section */}
                    <h2 className={styles.headingSpecial}>
                        <span className={styles.percentageSpecial}>19%</span> MORE CONVERSIONS
                    </h2>

                    {/* Content Section */}
                    <div className={styles.content}>
                        {/* Left Side - Competitor Icon */}


                        {/* Right Side - VSL Player Icon */}
                        <div className={styles.section}>
                            <Image src="/competitors4.svg" alt="CTA Comparison Graphic" width={600} height={280}/>
                        </div>
                    </div>

                    {/* Explanation Text */}
                    <p className={styles.explanation}>
                        On your average 10 visitors, 3 more will play the video when using VSL Player. We figure, if
                        users don’t watch, they don’t buy.
                    </p>
                </div>




            </div>
        </motion.div>
    );
};

export default Science;
