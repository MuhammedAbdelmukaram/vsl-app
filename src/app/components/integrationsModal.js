"use client";

import React, {useState} from "react";
import Select from "react-select";
import styles from "./IntegrationModal.module.css";
import {selectStyles} from "@/app/components/SelectStyles";
import Image from "next/image"; // Import the stylesheet

// Define integration options with correct names and logos
const integrationsOptions = [
    {value: "framer", label: "Framer", logo: "/integrationIcons/framerIcon.png"},
    {value: "clickfunnels", label: "ClickFunnels", logo: "/integrationIcons/ClickFunnelsIcon.png"},
    {value: "webflow", label: "Webflow", logo: "/integrationIcons/WebflowIcon.png"},
    {value: "wordpress", label: "WordPress", logo: "/integrationIcons/WordPressIcon.png"},
    {value: "shopify", label: "Shopify", logo: "/integrationIcons/ShopifyIcon.png"},
    {value: "squarespace", label: "SquareSpace", logo: "/integrationIcons/SquareSpaceIcon.png"},
    {value: "wix", label: "Wix", logo: "/integrationIcons/WixIcon.png"},
    {value: "woocommerce", label: "WooCommerce", logo: "/integrationIcons/WoCommerceIcon.png"},
    {value: "react", label: "React", logo: "/integrationIcons/ReactIcon.png"},
    {value: "gohighlevel", label: "Go High Level", logo: "/integrationIcons/GoHighLevelIcon.png"},
    {value: "slack", label: "Slack", logo: "/integrationIcons/SlackIcon.png"},
    {value: "zapier", label: "Zapier", logo: "/integrationIcons/ZapierIcon.png"}
];

// Custom Option Renderer (Dropdown List)
const CustomOption = (props) => {
    const {data, innerRef, innerProps} = props;
    return (
        <div ref={innerRef} {...innerProps} className={styles.option}>
            <img src={data.logo} alt={data.label} className={styles.optionLogo}/>
            {data.label}
        </div>
    );
};

// Custom Selected Value Renderer (Selected Item)
const CustomSingleValue = ({data}) => (
    <div className={styles.singleValue}>
        <img src={data.logo} alt={data.label} className={styles.optionLogo}/>
        {data.label}
    </div>
);

const IntegrationModal = ({isOpen, onClose, onSave}) => {
    const [selectedIntegrations, setSelectedIntegrations] = useState([]);

    if (!isOpen) return null;

    const handleChange = (selectedOptions) => {
        setSelectedIntegrations(selectedOptions);
    };

    const handleSave = () => {
        if (selectedIntegrations.length === 0) {
            alert("Please select at least one integration.");
            return;
        }
        onSave(selectedIntegrations.map(option => option.value));
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalInner}>

                    <div className={styles.xButton} onClick={onClose}>
                        <Image src="/closeIcon.png" height={20} width={20} alt={"closeIcon"}/>
                    </div>
                    <Image alt={"integrations image"} src="/addIntegrationsIcon.png" width={160} height={160}/>
                    <h3 className={styles.title}>Where do you build your websites?</h3>

                    {/* React-Select with custom rendering */}
                    <Select
                        options={integrationsOptions}
                        isMulti
                        value={selectedIntegrations}
                        onChange={handleChange}
                        className={styles.select}
                        classNamePrefix="react-select"
                        placeholder="Add your preferences..."
                        components={{Option: CustomOption, SingleValue: CustomSingleValue}}
                        styles={selectStyles}
                    />

                    <button className={styles.metric} onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IntegrationModal;
