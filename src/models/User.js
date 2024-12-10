// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], // User's videos
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

export default mongoose.models.User || mongoose.model("User", UserSchema);
