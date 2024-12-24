"use client";
import React from "react";
import { useRouter } from "next/navigation";

const CancelPage = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.push("/plan"); // Redirect to pricing page
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Subscription Canceled</h1>
            <p>You have canceled the subscription process. No charges have been made.</p>
            <button onClick={handleGoBack} style={{ padding: "10px 20px", cursor: "pointer" }}>
                Go Back to Plans
            </button>
        </div>
    );
};

export default CancelPage;
