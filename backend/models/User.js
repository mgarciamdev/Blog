const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, unique: true, trim: true, lowercase: true }, // Nombre de usuario unico para cada usuario
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        profileImageUrl: { type: String, default: null },
        bio: { type: String, default: "" },
        role: { type: String, enum: ["superadmin", "admin", "member"], default: "member" },
        lastUsernameChange: {type: Date, default: null},
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);