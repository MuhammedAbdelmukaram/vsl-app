"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast"; // ✅ Import toast
import styles from "./HelpModal.module.css";

const HelpModal = ({ isOpen, onClose }) => {
    const router = useRouter();
    const [view, setView] = useState("default");
    const [issueType, setIssueType] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Track loading state

    const handleClose = () => {
        setView("default");
        setIssueType("");
        setMessage("");
        onClose(); // ✅ Close modal
    };

    const handleSendSupportMessage = async () => {
        if (!issueType || !message) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        handleClose(); // ✅ Close modal immediately after clicking send

        try {

            const token = localStorage.getItem("token");
            console.log("Token", token)

            const userResponse = await fetch("/api/whoami", {
                method: "GET",
                headers: {
                    Authorization: token ? `Bearer ${token}` : "", // ✅ Send token in headers
                    "Content-Type": "application/json",
                },
            });
            const userData = userResponse.ok ? await userResponse.json() : null;

            // Send support message with user details
            const response = await fetch("/api/support", {
                method: "POST",
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    issueType,
                    message,
                    user: userData || { email: "Unknown User" } // Fallback if user info isn't available
                }),
            });

            if (response.ok) {
                toast.success("Support message sent successfully! ✅");
                setIssueType("");
                setMessage("");
                setView("default");
            } else {
                toast.error("Failed to send support message. Please try again.");
            }
        } catch (error) {
            console.error("Error sending support message:", error);
            toast.error("Something went wrong. Please try again.");
        }

        setLoading(false);
    };


    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.xButton} onClick={handleClose}>
                    <Image src="/closeIcon.png" height={20} width={20} alt="closeIcon" />
                </div>

                {view === "default" ? (
                    <>
                        <h3 className={styles.title}>Need Help?</h3>
                        <div className={styles.helpGrid}>
                            <div className={styles.helpBox} onClick={() => router.push("/guide")}>
                                <Image src="/supportIcons/4.png" alt="How To Add My VSL" width={160} height={160} />
                                <h4>How To Add My VSL</h4>
                                <p>Watch Tutorial</p>
                            </div>

                            <div className={styles.helpBox} onClick={() => router.push("/faq")}>
                                <Image src="/supportIcons/5.png" alt="FAQs" width={160} height={160} />
                                <h4>FAQs</h4>
                                <p>Most Common Cases</p>
                            </div>

                            <div className={styles.helpBox} onClick={() => setView("contact")}>
                                <Image src="/supportIcons/6.png" alt="Contact Support" width={160} height={160} />
                                <h4>Contact Support</h4>
                                <p>Available 24/7</p>

                            </div>
                        </div>
                        <div className={styles.buttonLayer}>
                            <button className={styles.metric} onClick={handleClose}>Close</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className={styles.title}>Contact Support</h3>
                        <div className={styles.contactSupportContainer}>
                            <div className={styles.supportLeft}>
                                <Image src="/supportIcons/6.png" alt="Support" width={120} height={120} />
                                <p>Available 24/7</p>
                                <p className={styles.replyText}>Reply in less than 1h</p>
                            </div>
                            <div className={styles.supportRight}>
                                <label>Type of Issue:</label>
                                <select
                                    className={styles.inputField}
                                    value={issueType}
                                    onChange={(e) => setIssueType(e.target.value)}
                                >
                                    <option value="" disabled>Select an issue</option>
                                    <option value="billing">Billing Issue</option>
                                    <option value="technical">Technical Issue</option>
                                    <option value="other">Other</option>
                                </select>

                                <label>Message:</label>
                                <textarea
                                    className={styles.textArea}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Describe your issue..."
                                />

                                <button
                                    className={styles.sendButton}
                                    onClick={handleSendSupportMessage}
                                    disabled={loading} // ✅ Disable while loading
                                >
                                    {loading ? "Sending..." : "Send"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HelpModal;
