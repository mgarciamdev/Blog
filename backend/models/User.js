const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, trim: true, lowercase: true }, // Nombre de usuario unico para cada usuario
        name: { type: String },
        email: { type: String, required: true },
        password: { type: String },
        profileImageUrl: { type: String, default: null },
        bio: { type: String, default: "" },
        role: { type: String, enum: ["superadmin", "admin", "member"], default: "member" },
        lastUsernameChange: { type: Date, default: null },

        // Validación de Email
        isVerified: { type: Boolean, default: false },
        verificationToken: { type: String, default: null },
        vfTokenExpires: { type: Date, default: null },

        //Recuperación de Contraseña
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
        lastPasswordChange: { type: Date, default: Date.now },

        //Refresh Token
        refreshToken: { type: String, default: null },

        //Estados rapidos
        isBanned: { type: Boolean, default: false },

        //Soft Delete
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// --- Índices ---
// Únicos solo entre usuarios no eliminados, para poder liberar el email/username cuando una cuenta se marca como eliminada.
UserSchema.index(
    { email: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false } }
);

UserSchema.index(
    { username: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false } }
);

// --- Middleware ---
// Excluye automáticamente usuarios eliminados de cualquier consulta find/findOne/findById/etc, a menos que la query ya especifique isDeleted explícitamente.
UserSchema.pre(/^find/, function () {
    if (!this.getQuery().hasOwnProperty("isDeleted")) {
        this.where({ isDeleted: false });
    }
});

// --- Statics ---
// Busca por _id ignorando el filtro de eliminados (auditoría, moderación)
UserSchema.statics.findByIdIncludingDeleted = function (id) {
    return this.findOne({ _id: id, isDeleted: { $in: [true, false] } });
};

// Busca con cualquier filtro ignorando el filtro de eliminados (login, reactivación)
UserSchema.statics.findOneIncludingDeleted = function (filter) {
    return this.findOne({ ...filter, isDeleted: { $in: [true, false] } });
};

module.exports = mongoose.model("User", UserSchema);