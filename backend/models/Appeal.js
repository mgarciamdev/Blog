const mongoose = require("mongoose");

const AppealSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Strike", required: true },
        ban: { type: mongoose.Schema.Types.ObjectId, ref: "Ban" },
        strike: { type: mongoose.Schema.Types.ObjectId, ref: "Strike" },
        message: { type: String, default: "" },
        status: { type: String, enum: ["pendiente", "aceptada", "rechazada"], default: "pendiente" },
        resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        resolvedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Appeal", AppealSchema);