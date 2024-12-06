import React from "react";
import styles from "./login.module.css";

const Page = () => {
    return (
        <div className={styles.page}>
            {/* Left section */}
            <div className={styles.leftSection}></div>

            {/* Right section */}
            <div className={styles.rightSection}>
                <div className={styles.formContainer}>
                    <h1>Welcome Back!</h1>
                    <p>Log in to your account</p>
                    <form>
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

                        <button type="submit" className={styles.loginButton}>
                            Log In
                        </button>
                    </form>
                    <div className={styles.loginLink}>
                        Don’t have an account? <a href="/signup">Sign Up</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
