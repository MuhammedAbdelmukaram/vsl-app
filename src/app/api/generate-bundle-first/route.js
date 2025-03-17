import { execSync } from "child_process";
import path from "path";
import { generateEmbedScript, uploadFileToR2WithToken } from "@/lib/uploadHelpers";
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
        const tempDir = path.join("/tmp", `temp_${buildId}`); // ✅ Updated for Vercel
        const outputDir = path.join("/tmp", `dist_${buildId}`); // ✅ Updated for Vercel

        console.log("Temporary directory path:", tempDir);
        console.log("Output directory path:", outputDir);

        fs.mkdirSync(tempDir, { recursive: true }); // ✅ Ensure /tmp/ directories exist
        fs.mkdirSync(outputDir, { recursive: true });

        // Write video config
        const tempConfigPath = path.join(tempDir, "video.config.json");
        fs.writeFileSync(tempConfigPath, JSON.stringify(video, null, 2), "utf8");

        try {
            console.log("Running Webpack with build ID:", buildId);
            execSync(
                `npx webpack --config webpack.config.js --env BUILD_ID=${buildId}`,
                { stdio: "inherit", cwd: tempDir } // ✅ Ensure Webpack runs inside /tmp/
            );

            const playerBundlePath = path.join(outputDir, "player.bundle.js"); // ✅ Updated

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
            const embedCode = generateEmbedScript(video._id, uploadedPlayerUrl);

            // ✅ **Store Embed Code in Database**
            await Video.findByIdAndUpdate(video._id, { playerUrl: uploadedPlayerUrl, playerEmbedCode: embedCode });

            return new Response(JSON.stringify({ success: true, playerEmbedCode: embedCode }), {
                status: 200,
            });
        } finally {
            // ✅ **Cleanup /tmp/ to prevent storage issues**
            fs.unlinkSync(tempConfigPath);
            fs.rmSync(tempDir, { recursive: true, force: true }); // ✅ Delete /tmp/temp_<buildId>
            fs.rmSync(outputDir, { recursive: true, force: true }); // ✅ Delete /tmp/dist_<buildId>
        }
    } catch (error) {
        console.error("Error generating or uploading player bundle:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
