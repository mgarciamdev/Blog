const mongoose = require("mongoose");

const StrikeSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        reason: { type: String, required: true },
        points: { type: Number, default: 1 },
        status: { type: String, enum: ["activo", "revocado"], default: "activo" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Strike", StrikeSchema);