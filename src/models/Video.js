import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Video owner

    name: { type: String, required: true }, // Video name/title

    // Video URLs
    videoUrl: { type: String, required: true }, // Uploaded video URL
    thumbnail: { type: String }, // Initial Thumbnail URL
    exitThumbnail: { type: String }, // Exit Thumbnail URL

    status:{type:String},
    // Options
    options: {
        fastProgressBar: { type: Boolean, default: false }, // Enable fast progress bar
        autoPlay: { type: Boolean, default: false }, // Auto-play enabled
        showThumbnail: { type: Boolean, default: false }, // Show initial thumbnail
        showExitThumbnail: { type: Boolean, default: false }, // Show exit thumbnail
    },

    // Customizable Video Settings
    pitchTime: { type: String }, // Time when pitch happens (e.g., "12:45")
    autoPlayText: { type: String }, // Auto-play overlay text
    brandColor: { type: String, default: "#ffffff" }, // Hex value of brand color
    iFrame: { type: String },

    // Analytics
    analytics: { type: mongoose.Schema.Types.ObjectId, ref: "Analytics" }, // Video's analytics data


    favorite: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
