import React, { Suspense } from "react";
import LoginPage from "./loginComponent";
import Loader from "../loader/page"
export default function LoginWrapper() {
    return (
        <Suspense fallback={<Loader />}>
            <LoginPage />
        </Suspense>
    );
}
