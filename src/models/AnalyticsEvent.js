import mongoose from "mongoose";

const { Schema } = mongoose;

const AnalyticsEventSchema = new Schema({
    id: { type: String, required: true },
    createdAt: { type: Number, required: true },
    event: { type: String, required: true },
    accountId: { type: String, required: true },
    device: { type: String, required: true },
    sessionId: { type: String, required: true },
    media_id: { type: String },
    media_type: { type: String, default: "video" },
    domain: { type: String },
    path: { type: String },
    uri: { type: String },
    player_id: { type: String },
    player_version: { type: String },
    metadata: { type: Object, required: true },
    data: { type: Object, default: {} },
});

export default mongoose.models.AnalyticsEvent || mongoose.model("AnalyticsEvent", AnalyticsEventSchema);
