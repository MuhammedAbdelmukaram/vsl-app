"use client";
import React, {useEffect, useState} from "react";
import styles from "./profile.module.css";
import Layout from "../components/LayoutHS";
import {useRouter} from "next/navigation";
import Loader from "@/app/loader/page";
import Avatar from "react-avatar";

const Page = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        repeatNewPassword: "",
    });

    const router = useRouter();

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found, please log in.");
                }

                const response = await fetch("/api/getProfile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }

                const data = await response.json();
                console.log(data);
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleNavigateToPlans = () => {
        router.push("/plans");
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handlePasswordChange = (e) => {
        const {name, value} = e.target;
        setPasswordForm((prev) => ({...prev, [name]: value}));
    };

    const calculateSubscriptionPrice = (plan, subscriptionEndDate) => {
        if (!plan || !subscriptionEndDate) return null;

        const currentDate = new Date();
        const endDate = new Date(subscriptionEndDate);

        const isYearly = endDate - currentDate > 2592000000 * 6; // More than ~6 months
        if (plan === "Basic") return isYearly ? "$50/year" : "$60/month";
        if (plan === "Pro") return isYearly ? "$100/year" : "$120/month";

        return null;
    };

    const handleCancelSubscription = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/cancelSubscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({subscriptionId: profile.stripeSubscriptionId}),
            });

            if (!response.ok) {
                throw new Error("Failed to cancel subscription");
            }

            const data = await response.json();
            setProfile((prev) => ({
                ...prev,
                subscriptionStatus: "canceled",
                subscriptionEndDate: new Date().toISOString(), // Set to the current date
            }));
            alert("Subscription canceled successfully.");
            setIsCancelModalOpen(false);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleSubmitPassword = async () => {
        if (passwordForm.newPassword !== passwordForm.repeatNewPassword) {
            alert("New passwords do not match!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/changePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(passwordForm),
            });

            if (!response.ok) {
                throw new Error("Failed to change password");
            }

            alert("Password updated successfully!");
            handleCloseModal();
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    if (loading) return <Loader/>;
    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>No profile data available</div>;

    return (
        <Layout>
            <div className={styles.profileContainer}>
                <div className={styles.wrapper}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "flex-end",
                        height: "100%"
                    }}>
                        <div className={styles.profileCard}>
                            <div className={styles.profilePicture}>
                                <div >
                                    <Avatar name={profile.name} size="80" round={true} color="#9f2b10"/>
                                </div>
                            </div>
                            <h2 className={styles.profileName}>{profile.name || "John Doe"}</h2>
                        </div>

                        <div className={styles.planCards}>
                            <div className={styles.planCard} onClick={handleNavigateToPlans}>
                                <div className={styles.planHeader}>
                                    <span>Your Plan</span>
                                    <span className={styles.planStatus}>{profile.subscriptionStatus || "Active"}</span>
                                </div>
                                <h2 className={styles.planTitle}>{profile.plan || "Basic Plan"}</h2>
                                <p className={styles.planPrice}>
                                    {calculateSubscriptionPrice(profile.plan, profile.subscriptionEndDate) ||
                                        "$59/month"}
                                </p>
                            </div>

                            <div className={styles.renewCard}>
                                <span>Renews at</span>
                                <h2 className={styles.planTitle}>
                                    {profile.subscriptionEndDate
                                        ? new Date(profile.subscriptionEndDate).toLocaleDateString()
                                        : "Oct 26, 2024"}
                                </h2>

                                <div className={styles.cancelWrapper}>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => setIsCancelModalOpen(true)}
                                    >
                                        Cancel Subscription
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.line}></div>

                    <div className={styles.contentWrapper}>
                        <div className={styles.leftSection}>
                            <form className={styles.profileForm}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="name">Name</label>
                                    <input id="name" type="text" defaultValue={profile.name || "John Doe"}/>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email"
                                           defaultValue={profile.email || "john.doe@example.com"}/>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="phone">Phone Number</label>
                                    <input id="phone" type="tel"
                                           defaultValue={profile.phoneNumber || "+1 234 567 890"}/>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="password">Password</label>
                                    <button type="button" className={styles.changePasswordButton}
                                            onClick={handleOpenModal}>
                                        Change Password
                                    </button>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="company">Company Name</label>
                                    <input id="company" type="text"
                                           defaultValue={profile.enterpriseDetails?.companyName || "Company Name"}/>
                                </div>
                            </form>
                        </div>

                        <div className={styles.rightSection}>
                            <div className={styles.billingHistory}>
                                <h2 className={styles.billingTitle}>Billing History</h2>
                                <table className={styles.billingTable}>
                                    <thead>
                                    <tr>
                                        <th>Invoice</th>
                                        <th>Status</th>
                                        <th>Amount</th>
                                        <th>Plan</th>
                                        <th>Download</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {profile.billingHistory?.map((bill, index) => (
                                        <tr key={index}>
                                            <td>{new Date(bill.date).toLocaleDateString()}</td>
                                            <td>
                                                <span className={styles.paidStatus}>{bill.status || "Paid"}</span>
                                            </td>
                                            <td>${bill.amount || "59.99"}</td>
                                            <td>{bill.plan || "Basic Plan"}</td>
                                            <td>
                                                <button className={styles.downloadButton}>Download</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Change Password</h2>
                        <div className={styles.modalInputs}>


                            <div className={styles.inputGroup}>
                                <label htmlFor="oldPassword">Old Password</label>
                                <input
                                    id="oldPassword"
                                    type="password"
                                    name="oldPassword"
                                    value={passwordForm.oldPassword}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="repeatNewPassword">Repeat New Password</label>
                                <input
                                    id="repeatNewPassword"
                                    type="password"
                                    name="repeatNewPassword"
                                    value={passwordForm.repeatNewPassword}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button onClick={handleCloseModal} className={styles.cancelButton}>
                                Cancel
                            </button>
                            <button onClick={handleSubmitPassword} className={styles.saveButton}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isCancelModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Are you sure?</h2>
                        <p>
                            Are you sure you want to cancel your subscription? This action cannot be undone.
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                onClick={() => setIsCancelModalOpen(false)}
                                className={styles.cancelButton}
                            >
                                No, Keep Subscription
                            </button>
                            <button
                                onClick={handleCancelSubscription}
                                className={styles.confirmButton}
                            >
                                Yes, Cancel Subscription
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Page;
