import { decodeJwt } from "jose";

export const uploadVideoToR2 = async (file, setVideoId, setUploadedVideoUrl, setUploadStatus, setUploadProgress) => {
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
        await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", signedUrl);
            xhr.setRequestHeader("Content-Type", file.type);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    console.log(`Upload progress: ${Math.round(percentComplete)}%`);
                    setUploadProgress(percentComplete);
                    setUploadStatus(`Uploading: ${Math.round(percentComplete)}%`);
                }
            };


            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve();
                } else {
                    reject(new Error("Upload failed"));
                }
            };

            xhr.onerror = () => reject(new Error("Upload error"));
            xhr.send(file);
        });



        // Construct the custom domain URL
        const customDomainUrl = uploadUrl.replace(
            "https://pub-c376537ae6c646e39fabf6d97ec84d7b.r2.dev",
            "https://cdn.vslapp.pro"
        );

        const duration = await getVideoDuration(file); // in seconds
        const formattedDuration = formatTime(duration); // e.g. "2:34"



        // Save video details to DB and retrieve video ID
        // Then pass it to saveVideoToDB
        const id = await saveVideoToDB(customDomainUrl, token, file.name, formattedDuration);

        setVideoId(id);
        setUploadedVideoUrl(customDomainUrl);
        setUploadStatus("Uploaded Successfully!");
    } catch (error) {
        console.error("Upload Error:", error);
        setUploadStatus("Upload Failed. Please try again.");
    }
};


// Function to save video to database
export const saveVideoToDB = async (videoUrl, token, videoName, length) => {
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
                length, // ✅ send duration here
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


const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            resolve(video.duration); // in seconds
        };
        video.onerror = () => reject("Error loading video metadata");
        video.src = URL.createObjectURL(file);
    });
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};



const uploadFileToR2Alt = async (file, folder, token) => {
    try {
        if (!file.content || !file.name) {
            throw new Error("Invalid file content or name");
        }

        const decodedToken = decodeJwt(token);
        const userId = decodedToken?.id;
        if (!userId) {
            throw new Error("User ID not found in token payload.");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload-video`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                fileName: file.name,
                fileType: file.type,
                folder,
                userId, // Pass userId explicitly
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch signed URL: ${await response.text()}`);
        }

        const { signedUrl, uploadUrl } = await response.json();

        console.log("SINGGggGED", signedUrl)
        console.log("UPLOAAaADED",uploadUrl)

        // Upload the raw file content to the signed URL
        const uploadResponse = await fetch(signedUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file.content, // This should be a Buffer or Blob
        });

        // Construct the custom domain URL
        const customDomainUrl = uploadUrl.replace(
            "https://pub-c376537ae6c646e39fabf6d97ec84d7b.r2.dev",
            "https://cdn.vslapp.pro"
        );

        if (!uploadResponse.ok) {
            throw new Error(`Failed to upload file: ${await uploadResponse.text()}`);
        }

        console.log(`File uploaded successfully to: ${uploadUrl}`);
        return customDomainUrl;
    } catch (error) {
        console.error("Error in uploadFileToR2Alt:", error);
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

        // Request signed URL for file upload
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

        // Upload file to R2
        const uploadResponse = await fetch(signedUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        });

        if (!uploadResponse.ok) throw new Error("Failed to upload file");

        // Construct the custom domain URL
        const customDomainUrl = uploadUrl.replace(
            "https://pub-c376537ae6c646e39fabf6d97ec84d7b.r2.dev",
            "https://cdn.vslapp.pro"
        );

        return customDomainUrl; // Return the custom domain URL
    } catch (error) {
        console.error("Upload Error:", error);
        throw error;
    }
};

export const uploadFileToR2WithToken = async (
    file,
    folder,
    token,
    videoId,
    setUploadedPlayerUrl
) => {
    try {
        if (!file || !videoId) throw new Error("No file or video ID available");
        if (!token) throw new Error("Token is required for upload.");

        const decodedToken = decodeJwt(token);
        const userId = decodedToken?.id;
        if (!userId) {
            throw new Error("User ID not found in token payload.");
        }

        console.log("Starting uploadFileToR2WithToken...");
        console.log("File received:", file);
        console.log("Folder:", folder);
        console.log("Token:", token);
        console.log("Video ID:", videoId);

        // Pass userId to `uploadFileToR2Alt`
        const uploadUrl = await uploadFileToR2Alt(file, folder, token, userId);
        console.log("Upload URL received:", uploadUrl);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const apiUrl = `${baseUrl}/api/putVideoPlayer`;

        const payload = { videoId, playerUrl: uploadUrl };
        console.log("Payload sent to /api/putVideoPlayer:", payload);

        const updateResponse = await fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        console.log("Response from /api/putVideoPlayer:", updateResponse);
        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error("Error response from /api/putVideoPlayer:", errorText);
            throw new Error("Failed to update video player URL");
        }

        const responseBody = await updateResponse.json();
        console.log("Response body from /api/putVideoPlayer:", responseBody);

        console.log(uploadUrl)

       
        console.log(`Player URL updated successfully: ${uploadUrl}`);
        return uploadUrl;
    } catch (error) {
        console.error("Error in uploadFileToR2WithToken:", error);
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


export const generateEmbedScript = (videoId, playerUrl) => {
    if (!videoId || !playerUrl) throw new Error("Video ID and Player URL are required to generate embed script.");

    return `
        <link rel="preload" href="${playerUrl}" as="script">
        <script>
            var scriptId = "scr_video_player_${videoId}"; // Unique script ID per video
            if (!document.getElementById(scriptId)) {
                var s = document.createElement("script");
                s.id = scriptId;
                s.src = "${playerUrl}";
                s.async = true;
                document.head.appendChild(s);
            }
        </script>
    `;
};


