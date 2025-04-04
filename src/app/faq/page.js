"use client";
import React, { useState } from "react";
import styles from "./faq.module.css";
import Layout from "@/app/components/LayoutHS";
import HelpModal from "@/app/components/helpModal"; // ✅ Import HelpModal

const faqs = [
    {
        question: "How do I add it to my website?",
        answer: (
            <>
                It’s super simple. We’ve prepared a step-by-step guide{" "}
                <a
                    href="https://vslplayer.io/guide"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                >
                    here
                </a>{" "}
                to help you get set up quickly. If you get stuck or need help, our team is just a message away.
            </>
        )
    },
    {
        question: "How does the free trial work?",
        answer: "We offer a 14-day free trial so you can test everything risk-free. After the trial, your video will remain live but with a watermark and limited analytics — giving you time to upgrade without disruption. After that grace period, playback is paused until you upgrade."
    },
    {
        question: "Is your player responsive?",
        answer: "Absolutely. Our player is fully responsive and optimized to work seamlessly across all devices — whether your visitors are on desktop, tablet, or mobile. It auto-adjusts to deliver a smooth viewing experience anywhere."
    },
    {
        question: "Is it easy to cancel?",
        answer: "Yes, canceling is hassle-free. You can cancel your subscription anytime through your dashboard. No phone calls, no pressure — just a few clicks and you’re done."
    }
];




const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [search, setSearch] = useState("");
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [helpModalView, setHelpModalView] = useState("default");

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const openContactSupport = () => {
        setHelpModalView("contact"); // ✅ Set view to "contact"
        setIsHelpModalOpen(true); // ✅ Open modal
    };

    const filteredFaqs = faqs.filter((faq) =>
        faq.question.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className={styles.container}>

                <div className={styles.topBar}>
                    <div className={styles.searchContainer}>
                        <small>Search FAQ</small>
                        <input
                            type="text"
                            placeholder="How to add my VSL"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <button className={styles.askButton} onClick={openContactSupport}>
                        Ask Question
                    </button>
                </div>

                <h3 className={styles.subHeading}>Most Common Questions</h3>
                <div className={styles.faqList}>
                    {filteredFaqs.map((faq, index) => (
                        <div key={index} className={styles.statItem}>
                            <button className={styles.faqQuestion} onClick={() => toggleFAQ(index)}>
                                {faq.question}
                                <span className={`${styles.arrow} ${openIndex === index ? styles.rotate : ""}`}>
                                    ▼
                                </span>
                            </button>
                            {openIndex === index && <p className={styles.faqAnswer}>{faq.answer}</p>}
                        </div>
                    ))}
                </div>

                {/* ✅ Include Help Modal */}
                <HelpModal
                    isOpen={isHelpModalOpen}
                    onClose={() => setIsHelpModalOpen(false)}
                    initialView={helpModalView} // ✅ Pass initial view
                />
            </div>
        </Layout>
    );
};

export default FAQ;
