"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/home"; // Default to /home
    const priceId = searchParams.get("priceId"); // Price ID from query
    const planName = searchParams.get("planName"); // Plan name from query
    const billingPeriod = searchParams.get("billingPeriod"); // Billing period from query

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Reset error state

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                // Store the token in localStorage
                localStorage.setItem("token", result.token);

                // Redirect directly to /plan if coming from pricing
                if (redirectTo === "/plan" && priceId && planName && billingPeriod) {
                    router.push(
                        `/plan?priceId=${priceId}&planName=${planName}&billingPeriod=${billingPeriod}`
                    );
                } else {
                    router.push(redirectTo);
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.leftSection}></div>
            <div className={styles.rightSection}>
                <div className={styles.formContainer}>
                    <h1>Welcome Back!</h1>
                    <p>Log in to your account</p>
                    <form onSubmit={handleLogin}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="johndoe@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="********"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                        <button type="submit" className={styles.loginButton}>
                            Log In
                        </button>
                    </form>
                    <div className={styles.loginLink}>
                        Don’t have an account?
                        <a
                            href={`/signup?redirect=${redirectTo}${priceId ? `&priceId=${priceId}` : ""}${
                                planName ? `&planName=${planName}` : ""
                            }${billingPeriod ? `&billingPeriod=${billingPeriod}` : ""}`}
                        >
                            Sign Up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
