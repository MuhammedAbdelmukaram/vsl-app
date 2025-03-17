import { exec } from "child_process";
import { promisify } from "util";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const execPromise = promisify(exec);

export async function POST(req) {
    try {
        const { mp4Url, userId } = await req.json();
        if (!mp4Url || !userId) {
            return new Response(JSON.stringify({ error: "Missing video URL or user ID" }), { status: 400 });
        }

        // Define output paths
        const outputFolder = `/tmp/m3u8/${userId}`;
        const outputFile = `${outputFolder}/video.m3u8`;

        // Run FFmpeg command to convert MP4 to M3U8
        await execPromise(`mkdir -p ${outputFolder}`);
        await execPromise(
            `ffmpeg -i ${mp4Url} -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${outputFile}`
        );

        // Upload M3U8 and TS files to Cloudflare R2
        const s3 = new S3Client({
            region: "auto",
            endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
                secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
            },
        });

        const uploadPromises = [
            s3.send(new PutObjectCommand({ Bucket: "YOUR_BUCKET_NAME", Key: `videos/${userId}/video.m3u8`, Body: outputFile })),
            ...[0, 1, 2].map((i) =>
                s3.send(new PutObjectCommand({ Bucket: "YOUR_BUCKET_NAME", Key: `videos/${userId}/segment${i}.ts`, Body: `/tmp/m3u8/${userId}/segment${i}.ts` }))
            ),
        ];

        await Promise.all(uploadPromises);

        return new Response(JSON.stringify({ message: "M3U8 conversion completed!" }), { status: 200 });
    } catch (error) {
        console.error("Error converting to M3U8:", error);
        return new Response(JSON.stringify({ error: "Conversion failed" }), { status: 500 });
    }
}
