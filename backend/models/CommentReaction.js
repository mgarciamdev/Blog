const mongoose = require("mongoose");

const CommentReactionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
        type: { type: String, enum: ["like", "dislike"], required: true }
    },
    { timestamps: true }
);

CommentReactionSchema.index({ user: 1, comment: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("CommentReaction", CommentReactionSchema);