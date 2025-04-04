import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // Hashed password
        phoneNumber: { type: String },

        // Plan and Subscription Details
        plan: {
            type: String,
            enum: ["Free", "Monthly", "Lifetime", "Canceled", "Expired"],
            default: "Free",
        },

        trialStartDate: { type: Date, default: Date.now },
        stripeCustomerId: { type: String }, // Stripe Customer ID for tracking payments
        stripeSubscriptionId: { type: String }, // Active subscription ID in Stripe
        subscriptionStatus: {
            type: String,
            enum: ["active", "inactive", "canceled", "trialing", "past_due", "incomplete","incomplete", "incomplete_expired" ],
            default: "inactive",
        },
        subscriptionStartDate: { type: Date },
        subscriptionEndDate: { type: Date },

        cancellationFeedback: {
            reasons: [{ type: String }],
            canceledAt: { type: Date },
        },

        // Payment and Billing History
        billingHistory: [
            {
                invoiceId: { type: String },
                amount: { type: Number }, // Amount paid
                currency: { type: String, default: "usd" },
                status: { type: String, enum: ["paid", "unpaid", "failed", "canceled"] },
                date: { type: Date, default: Date.now },
                plan: { type: String }, // Added plan field to store the plan name
            },
        ],

        // Usage Metrics
        videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], // User's videos
        totalVideos: { type: Number, default: 0 }, // Count of videos uploaded
        storageUsed: { type: Number, default: 0 }, // In MB or GB
        maxStorage: { type: Number, default: 10000 }, // Default: 10000 MB for Free

        // Enterprise-specific Details
        enterpriseDetails: {
            companyName: { type: String },
            contactPerson: { type: String },
            contactEmail: { type: String },
            notes: { type: String },
        },

        // User Preferences
        favoredIntegrations: [{ type: String }], // Array to store user’s favored integrations
        isFirstTimeLogin: { type: Boolean, default: true }, // Track if user is logging in for the first time

        // Misc
        isActive: { type: Boolean, default: true }, // Account active status
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
