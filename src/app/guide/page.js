// app/guide/page.js or page.tsx

import React, { Suspense } from 'react';
import GuidePage from './GuidePage '; // renamed client page for clarity
import Loader from "../loader/page"

export default function Page() {
    return (
        <Suspense fallback={<Loader />}>
            <GuidePage />
        </Suspense>
    );
}
