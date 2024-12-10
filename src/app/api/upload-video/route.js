import { NextResponse } from 'next/server'; // Import NextResponse
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize Cloudflare R2 client
const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

export async function POST(request) {
    try {
        const { fileName, fileType, folder = "videos", userId = "default" } = await request.json();

        // Input validation
        if (!fileName || !fileType) {
            return NextResponse.json({ error: "Missing fileName or fileType" }, { status: 400 });
        }

        // Sanitize file name (replace invalid characters)
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9-_\.]/g, "_");

        // Construct file path in R2 bucket
        const key = `${folder}/${userId}-${sanitizedFileName}`;

        // Generate signed URL for PUT operation
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
        });

        const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 * 60 }); // 1 hour expiration

        const uploadUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

        // Return signed and public URLs
        return NextResponse.json({ signedUrl, uploadUrl });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
    }
}
