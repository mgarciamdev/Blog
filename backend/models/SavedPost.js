const mongoose = require("mongoose");

const SavedPostSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        post: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost", required: true },
        savedAt: { type: Date, default: Date.now }
    },
    {
        timestamps: true
    }
);

// Evitamos los duplicados
SavedPostSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model("SavedPost", SavedPostSchema);