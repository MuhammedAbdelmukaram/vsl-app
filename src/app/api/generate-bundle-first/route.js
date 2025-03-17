import { execSync } from "child_process";
import path from "path";
import {generateEmbedScript, uploadFileToR2WithToken} from "@/lib/uploadHelpers";

import fs from "fs";
import dbConnect from "@/lib/dbConnect";
import Video from "@/models/Video"; // Assuming a MongoDB model for storing video info

export const POST = async (req) => {
    try {
        console.log("Received POST request.");
        await dbConnect(); // Ensure database connection

        const body = await req.json();
        console.log("Request body:", body);

        const { video, token } = body;

        if (!video || !video._id) {
            return new Response(JSON.stringify({ error: "Invalid video data" }), { status: 400 });
        }
        if (!token) {
            return new Response(JSON.stringify({ error: "Authentication token is required" }), { status: 401 });
        }

        console.log("Video configuration:", video);

        const buildId = `${video.user}_${video._id}`;
        const tempDir = path.resolve(process.cwd(), `temp/${buildId}`);
        const outputDir = path.resolve(process.cwd(), `dist/${buildId}`);

        console.log("Temporary directory path:", tempDir);
        console.log("Output directory path:", outputDir);

        fs.mkdirSync(tempDir, { recursive: true });
        fs.mkdirSync(outputDir, { recursive: true });

        // Write video config
        const tempConfigPath = path.join(tempDir, "video.config.json");
        fs.writeFileSync(tempConfigPath, JSON.stringify(video, null, 2), "utf8");

        try {
            console.log("Running Webpack with build ID:", buildId);
            execSync(
                `npx webpack --config webpack.config.js --env BUILD_ID=${buildId}`,
                { stdio: "inherit" }
            );

            const playerBundlePath = path.resolve(outputDir, "player.bundle.js");

            // Read player file
            const playerFileContent = fs.readFileSync(playerBundlePath);
            const folder = `players/${video._id}`;

            // Upload player bundle
            const uploadedPlayerUrl = await uploadFileToR2WithToken(
                { name: `${video._id}-player.bundle.js`, type: "application/javascript", content: playerFileContent },
                folder,
                token,
                video._id
            );

            console.log("Uploaded player URL:", uploadedPlayerUrl);

            // ✅ **Generate Embed Code using the separate function**
            const embedCode = generateEmbedScript(video._id,uploadedPlayerUrl);

            // ✅ **Store Embed Code in Database**
            await Video.findByIdAndUpdate(video._id, { playerUrl: uploadedPlayerUrl, playerEmbedCode: embedCode });

            return new Response(JSON.stringify({ success: true, playerEmbedCode: embedCode }), {
                status: 200,
            });
        } finally {
            fs.unlinkSync(tempConfigPath);
        }
    } catch (error) {
        console.error("Error generating or uploading player bundle:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
