import React from 'react';
import styles from './profile.module.css';
import Layout from '../components/LayoutHS';

const Page = () => {
    return (
        <Layout>
            <div className={styles.profileContainer}>
                {/* Profile Header */}

                <div className={styles.wrapper}>

                    <div style={{display:"flex", justifyContent:"space-between", width:"100%", alignItems:"flex-end", height:"100%"}}>


                        <div className={styles.profileCard}>
                            <div className={styles.profilePicture}>
                                {/* Placeholder for profile image */}
                                <div className={styles.imagePlaceholder}></div>
                            </div>
                            <h2 className={styles.profileName}>John Doe</h2>
                        </div>

                        <div className={styles.planCards}>


                            <div className={styles.planCard}>
                                <div className={styles.planHeader}>
                                    <span>Monthly Plan</span>
                                    <span className={styles.planStatus}>Active</span>
                                </div>
                                <h2 className={styles.planTitle}>Basic Plan</h2>
                                <p className={styles.planPrice}>$59/month</p>
                            </div>

                            {/* Renew Date */}
                            <div className={styles.renewCard}>
                                <span>Renew at</span>
                                <h2 className={styles.renewDate}>Oct 26, 2024</h2>
                            </div>

                        </div>

                    </div>


                    <div className={styles.line}>
                    </div>


                    <div className={styles.contentWrapper}>
                        {/* Left Section */}
                        <div className={styles.leftSection}>


                            {/* Profile Info */}
                            <form className={styles.profileForm}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="name">Name</label>
                                    <input id="name" type="text" placeholder="John Doe"/>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" placeholder="john.doe@example.com"/>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="phone">Phone Number</label>
                                    <input id="phone" type="tel" placeholder="+1 234 567 890"/>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="password">Password</label>
                                    <button className={styles.changePasswordButton}>Change Password</button>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="company">Company Name</label>
                                    <input id="company" type="text" placeholder="Company Name"/>
                                </div>
                            </form>
                        </div>

                        {/* Right Section */}
                        <div className={styles.rightSection}>
                            {/* Current Plan */}

                            {/* Billing History */}
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
                                    {Array(7).fill().map((_, index) => (
                                        <tr key={index}>
                                            <td>1 Mar, 2024</td>
                                            <td><span className={styles.paidStatus}>Paid</span></td>
                                            <td>$59.99</td>
                                            <td>Basic Plan</td>
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
        </Layout>
    );
};

export default Page;
