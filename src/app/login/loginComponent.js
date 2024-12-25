"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

const LoginPage = () => {
    const router = useRouter();
    const [queryParams, setQueryParams] = useState({
        redirectTo: "/home", // Default values
        priceId: null,
        planName: null,
        billingPeriod: null,
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setQueryParams({
            redirectTo: params.get("redirect") || "/home",
            priceId: params.get("priceId"),
            planName: params.get("planName"),
            billingPeriod: params.get("billingPeriod"),
        });
    }, []);

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
                localStorage.setItem("token", result.token);

                if (
                    queryParams.redirectTo === "/plan" &&
                    queryParams.priceId &&
                    queryParams.planName &&
                    queryParams.billingPeriod
                ) {
                    router.push(
                        `/plan?priceId=${queryParams.priceId}&planName=${queryParams.planName}&billingPeriod=${queryParams.billingPeriod}`
                    );
                } else {
                    router.push(queryParams.redirectTo);
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
                            href={`/signup?redirect=${queryParams.redirectTo}${
                                queryParams.priceId ? `&priceId=${queryParams.priceId}` : ""
                            }${queryParams.planName ? `&planName=${queryParams.planName}` : ""}${
                                queryParams.billingPeriod
                                    ? `&billingPeriod=${queryParams.billingPeriod}`
                                    : ""
                            }`}
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
