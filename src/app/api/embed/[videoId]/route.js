// app/api/embed/[videoId]/route.js
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const { videoId } = params;

    // Example data fetch (you can fetch from your database or API)
    const videoData = {
        thumbnail: `https://your-cdn.com/thumbnails/${videoId}.jpg`,
        scriptUrl: `https://your-cdn.com/players/${videoId}/player.js`,
        videoUrl: `https://your-cdn.com/videos/${videoId}/main.m3u8`,
    };

    const embedCode = `
<div id="vid_${videoId}" style="position: relative; width: 100%; padding: 56.25% 0 0;">
    <img id="thumb_${videoId}" src="${videoData.thumbnail}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: block;" alt="thumbnail">
    <div id="backdrop_${videoId}" style="position: absolute; top: 0; height: 100%; width: 100%; backdrop-filter: blur(5px);"></div>
</div>
<script type="text/javascript">
    var s = document.createElement("script");
    s.src = "${videoData.scriptUrl}";
    s.async = true;
    document.head.appendChild(s);
</script>
<link rel="preload" href="${videoData.scriptUrl}" as="script">
<link rel="preload" href="${videoData.thumbnail}" as="image">
<link rel="preload" href="${videoData.videoUrl}" as="fetch">
<link rel="dns-prefetch" href="https://your-cdn.com">
    `;

    return NextResponse.json({ embedCode });
}
