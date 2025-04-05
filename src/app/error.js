"use client"

export default function GlobalError({ error, reset }) {
    return (
        <div style={{ padding: "80px", textAlign: "center" }}>
            <h1>Something went wrong</h1>
            <p>Please refresh or go <a href="/">home</a>.</p>
        </div>
    );
}
