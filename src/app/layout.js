import { Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster
import "./globals.css";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    variable: "--font-roboto",
});

export const metadata = {
    metadataBase: new URL("https://vslplayer.io"),
    title: "VSL Player – Host, Optimize & Analyze Your Video Sales Letters",
    description:
        "VSL Player is a powerful tool to embed, analyze, and optimize high-converting video sales letters. Boost conversions with split-testing, detailed analytics, and seamless embeds.",
    keywords: [
        "VSL Player",
        "Video Sales Letter",
        "VSL Funnel",
        "VSL Hosting",
        "Video Analytics",
        "VSL Software",
        "High-Converting VSL",
        "Optimize Video Sales Letter",
        "Sales Funnel with VSL",
        "Marketing Analytics",
        "VSL for SaaS",
        "VSL for Coaches",
        "VSL for Agencies"
    ].join(", "),
    openGraph: {
        title: "VSL Player – Host, Optimize & Analyze Your VSLs",
        description:
            "Easily embed, test, and improve your Video Sales Letters with VSL Player’s powerful analytics, A/B testing, and conversion tracking.",
        url: "https://vslplayer.io",
        siteName: "VSL Player",
        images: [
            {
                url: "/og-image.jpg", // Relative now, resolved via metadataBase
                width: 1200,
                height: 630,
                alt: "VSL Player Dashboard",
            },
        ],
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "VSL Player – Host & Optimize Your Video Sales Letters",
        description: "Embed & track high-converting VSLs with advanced analytics.",
        images: ["/og-image.jpg"],
    },
};



export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={roboto.variable}>
        <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Add Toaster here */}
        {children}
        </body>
        </html>
    );
}
