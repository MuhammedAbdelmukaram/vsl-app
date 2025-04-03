import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import AnalyticsEvent from "../../../models/AnalyticsEvent";
import requestIp from "request-ip";
import { UAParser } from "ua-parser-js";
import axios from "axios";

// ✅ Get Country from IP
const getCountryFromIP = async (ip) => {
    try {
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        return response.data.country_name || "Unknown";
    } catch (error) {
        console.error("Error fetching country:", error);
        return "Unknown";
    }
};

// ✅ API Route for Analytics Tracking
export async function POST(req) {
    try {
        await dbConnect();
        const eventData = await req.json();

        if (!eventData || !eventData.event || !eventData.accountId || !eventData.sessionId) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        // Extract user details
        const ip = requestIp.getClientIp(req);
        const country = await getCountryFromIP(ip);

        // ✅ Parse user agent using `ua-parser-js`
        const uaParser = new UAParser();
        uaParser.setUA(req.headers.get("user-agent") || "");
        const browser = uaParser.getBrowser().name || "Unknown";
        const rawDeviceType = uaParser.getDevice().type;
        const deviceType = rawDeviceType ? rawDeviceType.toLowerCase() : "desktop";
        const os = uaParser.getOS().name || "Unknown";

        // ✅ Store in MongoDB
        const newEvent = new AnalyticsEvent({
            ...eventData, // Store event details from frontend
            ip,
            country,
            browser,
            deviceType,
            os,
        });

        await newEvent.save();

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error saving analytics event:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
