export default function NotFound() {
    return (
        <div style={{
            padding: "80px",
            textAlign: "center",
            fontFamily: "sans-serif",
        }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>404 – Page Not Found</h1>
            <p style={{ fontSize: "1.2rem", color: "#666" }}>
                Oops, the page you're looking for doesn't exist.
            </p>
            <a href="/" style={{
                display: "inline-block",
                marginTop: "2rem",
                textDecoration: "none",
                color: "#fff",
                background: "#d45900",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: "bold"
            }}>
                Back to Home
            </a>
        </div>
    );
}
