"use client";
import React, { useState } from "react";
import styles from "./faq.module.css";
import Layout from "@/app/components/LayoutHS";
import HelpModal from "@/app/components/HelpModal"; // ✅ Import HelpModal

const faqs = [
    {
        question: "How do I add my video to my website?",
        answer: "You can embed the video using an iframe or upload it directly."
    },
    {
        question: "How do I add my video to my website?",
        answer: "You can embed the video using an iframe or upload it directly."
    },
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
