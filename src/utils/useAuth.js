"use client";
import { useEffect, useState } from "react";

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Set true if token exists
        setLoading(false); // Mark as not loading
    }, []);

    return { isLoggedIn, loading };
};

export default useAuth;
