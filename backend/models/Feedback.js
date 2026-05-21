const mongoose = require("mongoose");

const FeedBackSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, default: "" },
        message: { type: String, required: true },
        category: { type: String, enum: ["sugerencia", "bug", "pregunta", "otro"], default: "otro" },
        status: { type: String, enum: ["pending", "read", "responded"], default: "pending" },
        response: {
            content: { type: String },
            responder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            respondedAt: { type: Date }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedBackSchema);