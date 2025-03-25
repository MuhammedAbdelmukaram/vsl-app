// app/guide/page.js or page.tsx

import React, { Suspense } from 'react';
import GuidePage from './GuidePage '; // renamed client page for clarity

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GuidePage />
        </Suspense>
    );
}
