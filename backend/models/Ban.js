const mongoose = require("mongoose");

const BanSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        bannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        reason: { type: String, required: true },
        type: { type: String, enum: ["temporal", "permanente"], default: "temporal" },
        bannedAt: { type: Date, default: Date.now },
        unbannedAt: { type: Date, default: null },
        unbannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        expiresAt: { type: Date, default: null },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Ban", BanSchema);