import { Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster
import "./globals.css";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    variable: "--font-roboto",
});

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
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
