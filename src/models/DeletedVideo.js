import mongoose from "mongoose";

const DeletedVideoSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnail: { type: String },
    exitThumbnail: { type: String },
    status: { type: String },
    options: {
        fastProgressBar: { type: Boolean, default: false },
        autoPlay: { type: Boolean, default: false },
        showThumbnail: { type: Boolean, default: false },
        showExitThumbnail: { type: Boolean, default: false },
    },
    pitchTime: { type: String },
    autoPlayText: { type: String },
    brandColor: { type: String, default: "#ffffff" },
    iFrame: { type: String },
    analytics: { type: mongoose.Schema.Types.ObjectId, ref: "Analytics" },
    favorite: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.DeletedVideo || mongoose.model("DeletedVideo", DeletedVideoSchema);
