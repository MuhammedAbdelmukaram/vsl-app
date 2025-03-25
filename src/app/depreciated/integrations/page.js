"use client";
import React, { useState } from "react";
import styles from "./integrations.module.css";
import Layout from "../../components/LayoutHS";
import IntegrationBox from "@/app/components/IntegrationBox";
import SelectVideoModal from "@/app/components/selectVideoModal"; // Import the modal

const Page = () => {
    const [selectedIntegration, setSelectedIntegration] = useState(null);

    return (
        <Layout>
            <div className={styles.wrapper}>
                <IntegrationBox
                    photo="/integrationIcons/FramerIcon.png"
                    headline="Zapier"
                    status="Online"
                    description="2-3 Minutes"
                    onSelectIntegration={setSelectedIntegration}
                />
                <IntegrationBox
                    photo="/integrationIcons/ClickFunnelsIcon.png"
                    headline="Slack"
                    status="Online"
                    description="2-3 Minutes"
                    onSelectIntegration={setSelectedIntegration}
                />

                <IntegrationBox
                    photo="/integrationIcons/WebflowIcon.png"
                    headline="Zapier"
                    status="Online"
                    description="2-3 Minutes"
                    onSelectIntegration={setSelectedIntegration}
                />
                <IntegrationBox
                    photo="/integrationIcons/WordPressIcon.png"
                    headline="Slack"
                    status="Online"
                    description="2-3 Minutes"
                    onSelectIntegration={setSelectedIntegration}
                />

                <IntegrationBox
                    photo="/integrationIcons/ShopifyIcon.png"
                    headline="Zapier"
                    status="Online"
                    description="2-3 Minutes"
                    onSelectIntegration={setSelectedIntegration}
                />
                <IntegrationBox
                    photo="/integrationIcons/SquareSpaceIcon.png"
                    headline="Slack"
                    status="Online"
                    description="2-3 Minutes"
                    onSelectIntegration={setSelectedIntegration}
                />

                <IntegrationBox
                    photo="/integrationIcons/WixIcon.png"
                    headline="Zapier"
                    status="Online"
                    description="2-3 Minutes"
                    onSelectIntegration={setSelectedIntegration}
                />
                <IntegrationBox
                    photo="/integrationIcons/WoCommerceIcon.png"
                    headline="Slack"
                    status="Online"
                    description="2-3 Minutes"
                    onSelectIntegration={setSelectedIntegration}
                />
                <IntegrationBox
                    photo="/integrationIcons/ReactIcon.png"
                    headline="Slack"
                    status="Online"
                    description="2-3 Minutes"
                    onSelectIntegration={setSelectedIntegration}
                />
                <IntegrationBox
                    photo="/integrationIcons/GoHighLevelIcon.png"
                    headline="Slack"
                    status="Online"
                    description="2-3 Minutes"
                    onSelectIntegration={setSelectedIntegration}
                />


                {/* Other Integrations */}
            </div>

            {/* Select Video Modal */}
            <SelectVideoModal
                isOpen={!!selectedIntegration}
                onClose={() => setSelectedIntegration(null)}
                integration={selectedIntegration}
            />
        </Layout>
    );
};

export default Page;
