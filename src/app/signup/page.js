"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./signup.module.css";

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/home"; // Default to /home
    const priceId = searchParams.get("priceId"); // Price ID from query

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(""); // Reset error state
        setSuccess(""); // Reset success state

        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(result.message);
                // Store token (optional, if applicable)
                localStorage.setItem("token", result.token);

                // Redirect to the target page with priceId if applicable
                if (redirectTo === "/plan" && priceId) {
                    router.push(`/plan?priceId=${priceId}`);
                } else {
                    router.push(redirectTo);
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.leftSection}></div>
            <div className={styles.rightSection}>
                <div className={styles.formContainer}>
                    <h1>Transform Your VSLs Today</h1>
                    <p>Start your 14-day free trial</p>
                    <form onSubmit={handleSignup}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name" className={styles.label}>Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="johndoe@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="********"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.passwordRequirements}>
                            <p>Your password must include:</p>
                            <ul>
                                <li>Min 8 characters</li>
                                <li>Capital letter</li>
                                <li>One number</li>
                                <li>Special letter (!@#$%)</li>
                            </ul>
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                        {success && <p className={styles.success}>{success}</p>}
                        <button type="submit" className={styles.createAccount}>
                            Create Account
                        </button>
                    </form>
                    <div className={styles.loginLink}>
                        Already have an account?{" "}
                        <a href={`/login?redirect=${redirectTo}${priceId ? `&priceId=${priceId}` : ''}`}>Log In</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
