import React, { Suspense } from "react";
import Home from "./HomePage"; // or "../components/Home" depending on your structure

export default function HomePage() {
    return (
        <Suspense fallback={<div>Loading home...</div>}>
            <Home />
        </Suspense>
    );
}
