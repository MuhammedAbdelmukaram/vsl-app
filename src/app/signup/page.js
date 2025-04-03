"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./signup.module.css";

const SignupContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/home";
    const priceId = searchParams.get("priceId");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        uppercase: false,
        number: false,
        specialChar: false,
    });

    const validatePassword = (password) => {
        setPasswordValidations({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            specialChar: /[!@#$%]/.test(password),
        });
    };

    const allValid = Object.values(passwordValidations).every(Boolean);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            validatePassword(value);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!allValid) {
            setError("Please meet all password requirements.");
            return;
        }

        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(result.message);
                localStorage.setItem("token", result.token);
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
                            <p className={styles.passwordInstructions}>Your password must include:</p>
                            <ul>
                                <li style={{ color: passwordValidations.length ? "green" : "red" }}>
                                    {passwordValidations.length ? "✅" : "❌"} Min 8 characters
                                </li>
                                <li style={{ color: passwordValidations.uppercase ? "green" : "red" }}>
                                    {passwordValidations.uppercase ? "✅" : "❌"} Capital letter
                                </li>
                                <li style={{ color: passwordValidations.number ? "green" : "red" }}>
                                    {passwordValidations.number ? "✅" : "❌"} One number
                                </li>
                                <li style={{ color: passwordValidations.specialChar ? "green" : "red" }}>
                                    {passwordValidations.specialChar ? "✅" : "❌"} Special letter (!@#$%)
                                </li>
                            </ul>
                        </div>
                        {error && <p className={styles.error}>{error}</p>}
                        {success && <p className={styles.success}>{success}</p>}
                        <button
                            type="submit"
                            className={styles.createAccount}
                            disabled={!allValid}
                            style={{ opacity: allValid ? 1 : 0.5, cursor: allValid ? "pointer" : "not-allowed" }}
                        >
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


const SignupPage = () => {
    return (
        <Suspense fallback={<div>Loading signup...</div>}>
            <SignupContent />
        </Suspense>
    );
};

export default SignupPage;
