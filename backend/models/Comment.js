const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        post: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost", required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
        edited: { type: Boolean, default: false },
    },
    { timestamps: true }
);

CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1 });

module.exports = mongoose.model("Comment", CommentSchema);