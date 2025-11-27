const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        post: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost", required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // for threaded replies
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual para obtener las respuestas (solo los hijos directos)
CommentSchema.virtual("replies", {
    ref: "Comment",
    localField: "_id",
    foreignField: "parentComment"
});

module.exports = mongoose.model("Comment", CommentSchema);