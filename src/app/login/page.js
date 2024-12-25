import React, { Suspense } from "react";
import LoginPage from "./loginComponent";

export default function LoginWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginPage />
        </Suspense>
    );
}
