import { decodeJwt } from "jose";

// Function to upload video file to R2
export const uploadVideoToR2 = async (file, setVideoId, setUploadedVideoUrl, setUploadStatus) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found in localStorage.");

        // Decode JWT and extract user ID
        const decodedToken = decodeJwt(token);
        const userId = decodedToken?.id;
        if (!userId) throw new Error("User ID not found in token payload.");

        // Request signed URL for video upload
        const response = await fetch("/api/upload-video", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
                folder: "videos",
                userId,
            }),
        });

        if (!response.ok) throw new Error("Failed to get signed URL");
        const { signedUrl, uploadUrl } = await response.json();

        // Upload video to R2
        const uploadResponse = await fetch(signedUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        });

        if (!uploadResponse.ok) throw new Error("Failed to upload file");

        // Save video details to DB and retrieve video ID
        const id = await saveVideoToDB(uploadUrl, token, file.name);
        setVideoId(id);
        setUploadedVideoUrl(uploadUrl);
        setUploadStatus("Uploaded Successfully!");
    } catch (error) {
        console.error("Upload Error:", error);
        setUploadStatus("Upload Failed. Please try again.");
    }
};

// Function to save video to database
export const saveVideoToDB = async (videoUrl, token, videoName) => {
    try {
        const response = await fetch("/api/saveVideo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: videoName,
                videoUrl,
                thumbnail: "/default-thumbnail.jpg",
                exitThumbnail: "/default-thumbnail.jpg",
                options: {},
                pitchTime: null,
                autoPlayText: "",
                brandColor: "#ffffff",
            }),
        });

        if (!response.ok) throw new Error("Failed to save video");

        const savedVideo = await response.json();
        return savedVideo._id;
    } catch (error) {
        console.error("Database Error:", error);
        throw error;
    }
};

// General function to upload any file to R2
export const uploadFileToR2 = async (file, folder) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found in localStorage.");

        const decodedToken = decodeJwt(token);
        const userId = decodedToken?.id;
        if (!userId) throw new Error("User ID not found in token payload.");

        const response = await fetch("/api/upload-video", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
                folder,
                userId,
            }),
        });

        if (!response.ok) throw new Error("Failed to get signed URL");

        const { signedUrl, uploadUrl } = await response.json();

        const uploadResponse = await fetch(signedUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        });

        if (!uploadResponse.ok) throw new Error("Failed to upload file");
        return uploadUrl;
    } catch (error) {
        console.error("Upload Error:", error);
        throw error;
    }
};

// Function to handle thumbnail uploads
export const handleThumbnailUpload = async (
    file,
    type,
    videoId,
    setUploadedThumbnailUrl,
    setUploadedExitThumbnailUrl
) => {
    try {
        if (!file || !videoId) {
            console.error("No file or video ID available");
            return;
        }

        // Upload file to R2
        const folder = type === "thumbnail" ? "thumbnails" : "exit-thumbnails";
        const uploadUrl = await uploadFileToR2(file, folder);

        const token = localStorage.getItem("token");
        const updateResponse = await fetch("/api/putVideo", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                videoId,
                [type]: uploadUrl,
            }),
        });

        if (!updateResponse.ok) throw new Error("Failed to update video");

        if (type === "thumbnail") setUploadedThumbnailUrl(uploadUrl);
        else setUploadedExitThumbnailUrl(uploadUrl);

        console.log(`${type} updated successfully:`, uploadUrl);
    } catch (error) {
        console.error("Error updating thumbnail:", error);
    }
};
