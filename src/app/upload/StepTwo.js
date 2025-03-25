"use client";
import React, {useState, useEffect} from "react";
import styles from "./upload.module.css";
import ColorPicker from "@/app/components/colorPicker";
import VideoPlayer from "@/app/video-player/VideoPlayer";

const StepTwo = ({
                     videoId,
                     videoUrl, // Ensure this is passed
                     thumbnail,
                     exitThumbnail,
                     minutes,
                     seconds,
                     handleMinutesChange,
                     handleSecondsChange,
                     nextStep,
                     prevStep,
                     token,
                 }) => {
    const [activeTab, setActiveTab] = useState("General");
    const [isProcessing, setIsProcessing] = useState(false);
    const [m3u8Url, setM3u8Url] = useState(null);
    const [playerUrl, setPlayerUrl] = useState(null);

    const [formData, setFormData] = useState({
        fastProgressBar: true,  // ✅ Preselected
        autoPlay: true,         // ✅ Preselected
        showThumbnail: false,
        showExitThumbnail: false,
        exitThumbnailButtons: true, // ✅ Preselected
        pitchTime: `${minutes || 0}:${seconds || 0}`,
        autoPlayText: "Video Has Already Started", // ✅ Default text
        brandColor: "#ffffff",
        border: false,
        borderWidth: "1px",
        borderRadius: "0px",
        borderGlow: false,
        borderGlowColor: "#ffffff",
        borderColor: "#ffffff",
        theatreView: false,
        fullScreen: true,  // ✅ Preselected
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            pitchTime: `${minutes || 0}:${seconds || 0}`,
        }));
    }, [minutes, seconds]);

    const handleCheckboxChange = (e) => {
        const {id, checked} = e.target;

        // Special case: If user selects `showThumbnail`, disable `autoPlay`
        if (id === "showThumbnail") {
            if (thumbnail) {
                setFormData((prev) => ({
                    ...prev,
                    showThumbnail: checked,
                    autoPlay: checked ? false : prev.autoPlay, // Uncheck `autoPlay` if selecting thumbnail
                }));
            } else {
                alert("A thumbnail is required to enable this option.");
            }
            return;
        }

        setFormData((prev) => ({...prev, [id]: checked}));
    };

    const handleInputChange = (e) => {
        const {id, value} = e.target;
        setFormData((prev) => ({...prev, [id]: value}));
    };

    const handleBrandColorChange = (newColor) => {
        setFormData((prev) => ({...prev, brandColor: newColor}));
    };

    const handleBorderColorChange = (newColor) => {
        setFormData((prev) => ({...prev, borderColor: newColor}));
    };

    const handleBorderGlowChange = (e) => {
        setFormData((prev) => ({...prev, borderGlow: e.target.checked}));
    };

    const handleBorderGlowColorChange = (newColor) => {
        setFormData((prev) => ({...prev, borderGlowColor: newColor}));
    };

    const handleBorderRadiusChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            borderRadius: `${e.target.value}px`,
        }));
    };


    const handleSaveAndNext = async () => {
        setIsProcessing(true);

        try {
            // ✅ Step 1: Convert MP4 to M3U8 before generating player
            console.log("🎬 Converting MP4 to M3U8...");
            const convertResponse = await fetch("http://localhost:5000/convert-video", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({videoUrl, videoId}),
            });

            if (!convertResponse.ok) throw new Error("Failed to convert video");

            const convertData = await convertResponse.json();
            setM3u8Url(convertData.m3u8Url); // ✅ Save M3U8 URL

            console.log("✅ Conversion successful. M3U8 URL:", convertData.m3u8Url);

            // ✅ Step 2: Save settings in DB
            const saveResponse = await fetch("/api/putVideo", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    videoId,
                    m3u8Url: convertData.m3u8Url, // ✅ Store converted HLS URL in the database
                    options: {
                        fastProgressBar: formData.fastProgressBar,
                        autoPlay: formData.autoPlay,
                        showThumbnail: formData.showThumbnail,
                        showExitThumbnail: formData.showExitThumbnail,
                        exitThumbnailButtons: formData.exitThumbnailButtons,
                        border: formData.border,
                        borderWidth: formData.borderWidth,
                        borderRadius: formData.borderRadius,
                        borderColor: formData.borderColor,
                        theatreView: formData.theatreView,
                        fullScreen: formData.fullScreen,
                    },
                    pitchTime: formData.pitchTime,
                    autoPlayText: formData.autoPlayText,
                    brandColor: formData.brandColor,
                }),
            });

            if (!saveResponse.ok) throw new Error("Failed to update video settings");
            console.log("✅ Video settings updated successfully.");


            // ✅ Step 3: Fetch updated video data before generating the player
            const videoResponse = await fetch(`/api/getVideo/${videoId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!videoResponse.ok) throw new Error("Failed to fetch updated video");

            const updatedVideoData = await videoResponse.json();
            console.log("✅ Fetched updated video data:", updatedVideoData);


            // ✅ Step 4: Generate player after successful conversion
            console.log("🚀 Generating player...");
            const generateResponse = await fetch("http://localhost:5000/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    video: updatedVideoData, // ✅ Corrected - Passing updated video data
                    m3u8Url: convertData.m3u8Url,
                    token,
                }),
            });

            const generateData = await generateResponse.json();
            if (!generateResponse.ok) throw new Error(generateData.error || "Failed to generate player bundle");

            setPlayerUrl(generateData.playerUrl);
            console.log("✅ Player bundle generated:", generateData.playerUrl);

            const savePlayerUrlResponse = await fetch("/api/putVideo", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    videoId,
                    playerUrl: generateData.playerUrl, // ✅ Save player URL in DB
                }),
            });

            if (!savePlayerUrlResponse.ok) throw new Error("Failed to save player URL");

            console.log("✅ Player URL saved to DB:", generateData.playerUrl);

            setIsProcessing(false);
            nextStep(); // ✅ Move to next step
        } catch (error) {
            console.error("❌ Error processing video:", error);
            setIsProcessing(false);
        }
    };


    return (
        <div className={styles.container}>


            <div className={styles.stepContainer}>
                <h2 className={styles.title}>Enhance Your VSL</h2>

                {/* Video Player */}
                <VideoPlayer
                    url={videoUrl}
                    videoId={videoId}
                    accountId={video.user}
                    autoPlay={formData.autoPlay}
                    fastProgressBar={formData.fastProgressBar}
                    showThumbnail={formData.showThumbnail}
                    showExitThumbnail={formData.showExitThumbnail}
                    thumbnail={thumbnail}
                    exitThumbnail={exitThumbnail}
                    m3u8Url={m3u8Url}
                    autoPlayText={formData.autoPlayText}
                    brandColor={formData.brandColor}
                    border={formData.border}
                    borderWidth={formData.borderWidth}
                    borderRadius={formData.borderRadius}
                    borderColor={formData.borderColor}
                    borderGlow={formData.borderGlow}  // New: Pass glow state
                    borderGlowColor={formData.borderGlowColor}  // New: Pass glow color
                    theatreView={formData.theatreView}
                    fullScreen={formData.fullScreen}
                    exitThumbnailButtons={formData.exitThumbnailButtons}
                />


                {/* Tabs Navigation */}
                <div className={styles.tabNavigation}>
                    {["General", "Design", "Start", "Exit"].map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>


            </div>


            {/* Tab Content */}
            <div className={styles.tabContent}>
                {activeTab === "General" && (
                    <>
                        <div className={styles.inputGroup}>
                            <label>Pitch Time</label>
                            <div className={styles.timeInputsInner}>
                                <input type="number" placeholder="Minute" value={minutes} onChange={handleMinutesChange}
                                       min="0" max="59" className={styles.timeInput}/>
                                <input type="number" placeholder="Second" value={seconds} onChange={handleSecondsChange}
                                       min="0" max="59" className={styles.timeInput}/>
                            </div>
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="fullScreen" checked={formData.fullScreen}
                                   onChange={handleCheckboxChange}/>
                            <label htmlFor="fullScreen">Full Screen</label>
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="theatreView" checked={formData.theatreView}
                                   onChange={handleCheckboxChange}/>
                            <label htmlFor="theatreView">Theatre View</label>
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="fastProgressBar" checked={formData.fastProgressBar}
                                   onChange={handleCheckboxChange}/>
                            <label htmlFor="fastProgressBar">Fast Progress Bar</label>
                        </div>
                    </>
                )}

                {activeTab === "Design" && (
                    <>
                        <div className={styles.designGrid}>


                            <div className={styles.textInputs}>
                                <label>Progress Bar Color</label>
                                <ColorPicker color={formData.brandColor} onChange={handleBrandColorChange}/>
                            </div>

                            <div style={{borderBottom: "1px solid #fff"}}>


                                <div className={styles.checkboxWrapper}>
                                    <input type="checkbox" id="border" checked={formData.border}
                                           onChange={handleCheckboxChange}/>
                                    <label htmlFor="border">Enable Border</label>
                                </div>
                            </div>
                        </div>

                        {formData.border && (
                            <>
                                <div className={styles.wrapper}>


                                    <div className={styles.inputGroup}>
                                        <label>Border Width</label>
                                        <div className={styles.borderWidthGroup}>
                                            {["1px", "2px", "3px"].map((width) => (
                                                <button
                                                    key={width}
                                                    className={`${styles.borderWidthButton} ${formData.borderWidth === width ? styles.activeButton : ""}`}
                                                    onClick={() => setFormData((prev) => ({
                                                        ...prev,
                                                        borderWidth: width
                                                    }))}
                                                >
                                                    {width}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.inputGroup}>
                                        <label>Border Radius</label>
                                        <input type="range" min="0" max="8" step="1"
                                               value={parseInt(formData.borderRadius) || 0}
                                               onChange={handleBorderRadiusChange}/>
                                    </div>

                                    <div className={styles.textInputs}>
                                        <label>Border Color</label>
                                        <ColorPicker color={formData.borderColor} onChange={handleBorderColorChange}/>
                                    </div>

                                    {/* Border Glow Toggle */}

                                    <div className={styles.borderGlowContainer}>
                                        <div className={styles.checkboxWrapper}>
                                            <input type="checkbox" id="borderGlow" checked={formData.borderGlow} onChange={handleBorderGlowChange} />
                                            <label htmlFor="borderGlow">Enable Border Glow</label>
                                        </div>

                                        {formData.borderGlow && (
                                            <div className={styles.textInputs}>
                                                <label>Border Glow Color</label>
                                                <ColorPicker color={formData.borderGlowColor} onChange={handleBorderGlowColorChange} />
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </>
                        )}
                    </>
                )}


                {activeTab === "Start" && (
                    <>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="autoPlay" checked={formData.autoPlay}
                                   onChange={handleCheckboxChange}/>
                            <label htmlFor="autoPlay">Auto-Play</label>
                        </div>
                        <div className={styles.textInputs}>
                            <label>Auto-Play Text</label>
                            <input type="text" id="autoPlayText" value={formData.autoPlayText}
                                   onChange={handleInputChange}/>
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="showThumbnail" checked={formData.showThumbnail}
                                   onChange={handleCheckboxChange}/>
                            <label htmlFor="showThumbnail">Show Thumbnail</label>
                        </div>
                    </>
                )}

                {activeTab === "Exit" && (
                    <>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="showExitThumbnail" checked={formData.showExitThumbnail}
                                   onChange={handleCheckboxChange}/>
                            <label htmlFor="showExitThumbnail">Show Exit Thumbnail</label>
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <input type="checkbox" id="exitThumbnailButtons" checked={formData.exitThumbnailButtons}
                                   onChange={handleCheckboxChange}/>
                            <label htmlFor="exitThumbnailButtons">Show Exit Thumbnail Buttons</label>
                        </div>
                    </>
                )}
            </div>

            {/* Back and Next Buttons */}
            <div className={styles.buttonsContainer}>
                <button className={styles.backButton} onClick={prevStep}>Back</button>
                <button className={styles.nextButton} onClick={handleSaveAndNext}>Next Step</button>
            </div>
        </div>
    );
};

export default StepTwo;
