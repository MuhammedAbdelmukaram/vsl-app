import { execSync } from "child_process";
import path from "path";
import { uploadFileToR2WithToken } from "@/lib/uploadHelpers";
import fs from "fs";

export const POST = async (req) => {
    try {
        console.log("Received POST request.");

        const body = await req.json();
        console.log("Request body:", body);

        const { video, token } = body;

        if (!video || !video._id) {
            console.error("Invalid video data:", video);
            return new Response(JSON.stringify({ error: "Invalid video data" }), { status: 400 });
        }
        if (!token) {
            console.error("Authentication token is missing.");
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

        // Write the video configuration file in the unique temp directory
        const tempConfigPath = path.join(tempDir, "video.config.json");
        fs.writeFileSync(tempConfigPath, JSON.stringify(video, null, 2), "utf8");
        console.log("Video configuration file written to:", tempConfigPath);

        try {
            console.log("Running Webpack with build ID:", buildId);
            execSync(
                `npx webpack --config webpack.config.js --env BUILD_ID=${buildId}`,
                { stdio: "inherit" }
            );
            console.log("Webpack build completed.");

            // Paths to the generated bundles
            const playerBundlePath = path.resolve(outputDir, "player.bundle.js");
            const previewBundlePath = path.resolve(outputDir, "reactPlayerPreview.bundle.js");

            console.log("Player bundle path:", playerBundlePath);
            console.log("Preview bundle path:", previewBundlePath);

            // Read file content as Buffers
            const playerFileContent = fs.readFileSync(playerBundlePath);
            const previewFileContent = fs.readFileSync(previewBundlePath);

            // Upload the bundles
            const folder = `players/${video._id}`;
            const uploadedPlayerUrl = await uploadFileToR2WithToken(
                { name: `${video._id}-player.bundle.js`, type: "application/javascript", content: playerFileContent },
                folder,
                token,
                video._id
            );
            console.log("Uploaded player URL:", uploadedPlayerUrl);

            const uploadedPreviewUrl = await uploadFileToR2WithToken(
                { name: `${video._id}-reactPlayerPreview.bundle.js`, type: "application/javascript", content: previewFileContent },
                folder,
                token,
                video._id
            );
            console.log("Uploaded preview URL:", uploadedPreviewUrl);

            return new Response(JSON.stringify({ success: true, urls: { player: uploadedPlayerUrl, preview: uploadedPreviewUrl } }), {
                status: 200,
            });
        } finally {
            // Ensure the temporary config file is cleaned up
            fs.unlinkSync(tempConfigPath);
        }
    } catch (error) {
        console.error("Error generating or uploading player bundle:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
