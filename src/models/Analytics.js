// models/Analytics.js
import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true }, // The associated video
    date: { type: Date, required: true }, // Analytics for a specific day
    totalViews: { type: Number, default: 0 },
    ctaClicks: { type: Number, default: 0 },
    playRate: { type: Number, default: 0 },
    avgViewRate: { type: Number, default: 0 },
    pitchRetention: { type: Number, default: 0 },

    // Retention data for a specific date
    retention: [{
        timestamp: { type: String }, // Timestamp in the video (e.g., "00:10", "01:30")
        viewers: { type: Number, default: 0 },
    }],

    // Country, device, and browser rankings for that date
    countries: [{
        country: { type: String },
        views: { type: Number, default: 0 },
    }],
    devices: [{
        type: { type: String, enum: ["Mobile", "Desktop", "Tablet"] },
        count: { type: Number, default: 0 },
    }],
    browsers: [{
        name: { type: String },
        count: { type: Number, default: 0 },
    }],
    trafficSources: [{
        source: { type: String },
        count: { type: Number, default: 0 },
    }],
}, { timestamps: true }); // Adds createdAt and updatedAt

export default mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);
