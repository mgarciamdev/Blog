const mongoose = require("mongoose");

const AppealSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        ban: { type: mongoose.Schema.Types.ObjectId, ref: "Ban" },
        strike: { type: mongoose.Schema.Types.ObjectId, ref: "Strike" },
        message: { type: String, required: true },
        status: { type: String, enum: ["pendiente", "aceptada", "rechazada"], default: "pendiente" },
        reasonSnapshot: { type: String, required: true },
        resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        resolvedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Appeal", AppealSchema);