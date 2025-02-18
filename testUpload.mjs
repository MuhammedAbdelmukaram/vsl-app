import path from "path";
import { uploadFileToR2WithToken } from "./src/lib/uploadHelpers.mjs"; // Adjust the path and extension as needed

(async () => {
    const filePath = path.resolve(process.cwd(), "dist/player.bundle.js");
    const folder = "players/test-video-id"; // Example folder structure

    try {
        const uploadedUrl = await uploadFileToR2WithToken(
            {
                name: "player.bundle.js",
                type: "application/javascript",
                path: filePath,
            },
            folder
        );

        console.log("Upload successful! File URL:", uploadedUrl);
    } catch (error) {
        console.error("Upload failed:", error);
    }
})();
