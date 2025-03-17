import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
    url: "https://api.mailgun.net",
});

export async function POST(request) {
    try {
        const { issueType, message, user } = await request.json();

        // Extract user info (fallback to "Unknown" if not provided)
        const userEmail = user?.email || "Unknown User";
        const userName = user?.name || "Anonymous";

        // Send the email using Mailgun
        await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: `Support Form <postmaster@${process.env.MAILGUN_DOMAIN}>`,
            to: "mechalabsolutions@gmail.com",
            subject: `New Support Message from ${userName}`,
            text: `
                You have a new support message from (${userEmail}):
                - Issue Type: ${issueType}
                - Message: ${message}
            `,
        });

        return new Response(
            JSON.stringify({ message: "Email sent successfully!" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error sending email with Mailgun:", error);
        return new Response(
            JSON.stringify({ error: "Failed to send email" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
