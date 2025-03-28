import { execSync } from "child_process";
import path from "path";
import { generateEmbedScript, uploadFileToR2WithToken } from "@/lib/uploadHelpers";
import fs from "fs";
import dbConnect from "@/lib/dbConnect";
import Video from "@/models/Video";

export const POST = async (req) => {
    try {
        console.log("Received POST request.");
        await dbConnect();

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
        const tempDir = path.join("/tmp", `temp_${buildId}`);
        const outputDir = path.join("/tmp", `dist_${buildId}`);

        console.log("Temporary directory path:", tempDir);
        console.log("Output directory path:", outputDir);

        fs.mkdirSync(tempDir, { recursive: true });
        fs.mkdirSync(outputDir, { recursive: true });

        // ✅ Copy Webpack config to /tmp/
        const webpackConfigPath = path.resolve(process.cwd(), "webpack.config.js");
        const tempWebpackConfigPath = path.join(tempDir, "webpack.config.js");
        fs.copyFileSync(webpackConfigPath, tempWebpackConfigPath);

        // ✅ Write video config
        const tempConfigPath = path.join(tempDir, "video.config.json");
        fs.writeFileSync(tempConfigPath, JSON.stringify(video, null, 2), "utf8");

        try {
            console.log("Running Webpack with build ID:", buildId);
            execSync(
                `npx webpack --config webpack.config.js --env BUILD_ID=${buildId}`,
                { stdio: "inherit", cwd: tempDir }
            );

            const playerBundlePath = path.join(outputDir, "player.bundle.js");

            // ✅ Read player file
            const playerFileContent = fs.readFileSync(playerBundlePath);
            const folder = `players/${video._id}`;

            // ✅ Upload player bundle
            const uploadedPlayerUrl = await uploadFileToR2WithToken(
                { name: `${video._id}-player.bundle.js`, type: "application/javascript", content: playerFileContent },
                folder,
                token,
                video._id
            );

            console.log("Uploaded player URL:", uploadedPlayerUrl);

            // ✅ Generate Embed Code
            const embedCode = generateEmbedScript(video._id, uploadedPlayerUrl);

            // ✅ Store Embed Code in Database
            await Video.findByIdAndUpdate(video._id, { playerUrl: uploadedPlayerUrl, playerEmbedCode: embedCode });

            return new Response(JSON.stringify({ success: true, playerEmbedCode: embedCode }), {
                status: 200,
            });
        } finally {
            // ✅ Cleanup temp files
            fs.unlinkSync(tempConfigPath);
            fs.rmSync(tempDir, { recursive: true, force: true });
            fs.rmSync(outputDir, { recursive: true, force: true });
        }
    } catch (error) {
        console.error("Error generating or uploading player bundle:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
