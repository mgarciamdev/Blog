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

UserSchema.index(
    { email: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false } }
);

UserSchema.index(
    { username: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false } }
);

function excludeDeleted(next) {
    if (!this.getQuery().hasOwnProperty("idDeleted")) {
        this.where({ isDeleted: false });
    }
    next();
};

UserSchema.pre(/^find/, excludeDeleted);

UserSchema.statics.findByIdIncludingDeleted = function (id) {
    return this.findOne({ _id: id, isDeleted: { $in: [true, false] } });
};

UserSchema.statics.findOneIncludingDeleted = function (filter) {
    return this.findOne({ ...filter, isDeleted: { $in: [true, false] } });
};

module.exports = mongoose.model("User", UserSchema);