"use client";
import React from "react";
import styles from "./signup.module.css";
import {useRouter} from "next/navigation";

const Page = () => {
    const router = useRouter();
    const handleLogin = (e) => {
        e.preventDefault(); // Prevent form submission
        // Perform any login validation logic here (if needed)
        router.push("/home"); // Navigate to /home
    };

    return (
        <div className={styles.page}>
            {/* Left section */}
            <div className={styles.leftSection}></div>

            {/* Right section */}
            <div className={styles.rightSection}>
                <div className={styles.formContainer}>
                    <h1>Transform Your VSLs Today</h1>
                    <p>Start your 14-day free trial</p>
                    <form onSubmit={handleLogin}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name" className={styles.label}>
                                Name
                            </label>
                            <input id="name" type="text" placeholder="John Doe" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Email
                            </label>
                            <input id="email" type="email" placeholder="johndoe@gmail.com" />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>
                                Password
                            </label>
                            <input id="password" type="password" placeholder="********" />
                        </div>

                        <div className={styles.passwordRequirements}>
                            <p>Your password must include</p>
                            <ul>
                                <li>Min 8 characters</li>
                                <li>Capital letter</li>
                                <li>One number</li>
                                <li>Special letter (!@#$%)</li>
                            </ul>
                        </div>
                        <button type="submit" className={styles.createAccount}>
                            Create Account
                        </button>
                    </form>
                    <div className={styles.loginLink}>
                        Already have an account? <a href="/login">Log In</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
