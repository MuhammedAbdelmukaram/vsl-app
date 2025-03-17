"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./Guide.module.css";
import { selectStyles } from "@/app/components/selectStyles2";
import Image from "next/image";
import HeaderOutApp from "@/app/components/headerOutApp";
import Layout from "@/app/components/LayoutHS";

const integrationsOptions = [
    { value: "framer", label: "Framer", logo: "/integrationIcons/framerIcon.png" },
    { value: "clickfunnels", label: "ClickFunnels", logo: "/integrationIcons/ClickFunnelsIcon.png" },
    { value: "webflow", label: "Webflow", logo: "/integrationIcons/WebflowIcon.png" },
    { value: "wordpress", label: "WordPress", logo: "/integrationIcons/WordPressIcon.png" },
    { value: "shopify", label: "Shopify", logo: "/integrationIcons/ShopifyIcon.png" },
    { value: "squarespace", label: "SquareSpace", logo: "/integrationIcons/SquareSpaceIcon.png" },
    { value: "wix", label: "Wix", logo: "/integrationIcons/WixIcon.png" },
    { value: "woocommerce", label: "WooCommerce", logo: "/integrationIcons/WoCommerceIcon.png" },
    { value: "react", label: "React", logo: "/integrationIcons/ReactIcon.png" },
    { value: "gohighlevel", label: "Go High Level", logo: "/integrationIcons/GoHighLevelIcon.png" },
    { value: "slack", label: "Slack", logo: "/integrationIcons/SlackIcon.png" },
    { value: "zapier", label: "Zapier", logo: "/integrationIcons/ZapierIcon.png" }
];

// Step content for each integration
const stepContent = {
    framer: [
        "Open Framer and create a new project.",
        "Drag and drop the VSL player component into your project.",
        "Customize the player settings and publish your Framer site."
    ],
    clickfunnels: [
        "Log into ClickFunnels and select your funnel.",
        "Go to the page editor and add a new HTML/Embed element.",
        "Paste the VSL player embed code and save your changes."
    ],
    webflow: [
        "Open Webflow and go to the designer.",
        "Drag an Embed block onto your page.",
        "Paste the VSL player embed code and publish your Webflow site."
    ],
    wordpress: [
        "Log into your WordPress dashboard.",
        "Go to the page where you want to add the VSL player.",
        "Use a shortcode or embed block to insert the player."
    ],
    shopify: [
        "Log into Shopify and navigate to your theme editor.",
        "Add a custom HTML section to your product page.",
        "Paste the VSL player embed code and save your changes."
    ]
};

// Default steps when no selection is made
const defaultSteps = [
    "Select an integration to see the guide.",
    "Follow the instructions for your chosen platform.",
    "Test the VSL player to ensure it works correctly."
];

// Custom Option Renderer (Dropdown List)
const CustomOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
        <div ref={innerRef} {...innerProps} className={styles.option}>
            <Image src={data.logo} alt={data.label} width={20} height={20} className={styles.optionLogo} />
            {data.label}
        </div>
    );
};

// Custom Selected Value Renderer (Selected Item)
const CustomSingleValue = ({ data }) => (
    <div className={styles.singleValue}>
        <Image src={data.logo} alt={data.label} width={26} height={26} className={styles.optionLogo} />
        {data.label}
    </div>
);

const Page = () => {
    const [selectedIntegration, setSelectedIntegration] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkedAuth, setCheckedAuth] = useState(false); // Ensures hydration consistency

    // Check if user is logged in (token exists in localStorage)
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
        setCheckedAuth(true); // Prevent hydration mismatch
    }, []);

    const handleChange = (selectedOption) => {
        setSelectedIntegration(selectedOption);
    };

    const steps = selectedIntegration ? stepContent[selectedIntegration.value] || defaultSteps : defaultSteps;

    if (!checkedAuth) return null; // Prevents hydration issues

    return (
        <>
            {isLoggedIn ? (
                <Layout>
                    <div className={styles.container}>
                        <div className={styles.content}>
                            <h1 className={styles.title}>How To Add VSL Player</h1>
                            <p className={styles.subtitle}>Complete Guide</p>

                            {/* React-Select Dropdown */}
                            <div className={styles.dropdownContainer}>
                                <Select
                                    options={integrationsOptions}
                                    value={selectedIntegration}
                                    onChange={handleChange}
                                    className={styles.select}
                                    classNamePrefix="react-select"
                                    placeholder="Select an Integration..."
                                    components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                                    styles={selectStyles}
                                />
                            </div>

                            {/* Video Placeholder */}
                            <div className={styles.videoPlaceholder}></div>

                            {/* Section Title */}
                            <h2 className={styles.sectionTitle}>
                                How To Add VSL Player to {selectedIntegration?.label || "your platform"}
                            </h2>

                            {/* Steps */}
                            <div className={styles.steps}>
                                {steps.map((step, index) => (
                                    <div key={index} className={styles.step}>
                                        <span className={styles.stepNumber}>{index + 1}</span>
                                        <p>{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Layout>
            ) : (
                <>
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <HeaderOutApp/>
                        </div>

                        <div className={styles.content}>


                            <h1 className={styles.title}>How To Add VSL Player</h1>
                            <p className={styles.subtitle}>Complete Guide</p>

                            {/* React-Select Dropdown */}
                            <div className={styles.dropdownContainer}>
                                <Select
                                    options={integrationsOptions}
                                    value={selectedIntegration}
                                    onChange={handleChange}
                                    className={styles.select}
                                    classNamePrefix="react-select"
                                    placeholder="Select an Integration..."
                                    components={{Option: CustomOption, SingleValue: CustomSingleValue}}
                                    styles={selectStyles}
                                />
                            </div>

                            {/* Video Placeholder */}
                            <div className={styles.videoPlaceholder}></div>

                            {/* Section Title */}
                            <h2 className={styles.sectionTitle}>How To Add VSL Player
                                to {selectedIntegration?.label || "your platform"}</h2>

                            {/* Steps */}
                            <div className={styles.steps}>
                                {steps.map((step, index) => (
                                    <div key={index} className={styles.step}>
                                        <span className={styles.stepNumber}>{index + 1}</span>
                                        <p>{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Page;
