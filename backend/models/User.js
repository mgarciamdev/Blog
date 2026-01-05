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
        lastUsernameChange: { type: Date, default: null },

        // Validación de Email
        isVerified: { type: Boolean, default: false },
        verificationToken: { type: Date, default: null },
        vfTokenExpires: { type: Date, default: null },

        //Recuperación de Contraseña
        resetPasswordToken: { type: String, default: null },
        rsPassTokenExpires: { type: String, default: null },
        lastPasswordChange: { type: Date, default: Date.now },

        //Refresh Token
        refreshToken: { type: String, default: null }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);