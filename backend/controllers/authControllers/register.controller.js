const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmail");
const { sendVerificationEmail } = require("../../utils/emailHelpers");

// @desc    Registro de nuevos usuarios
// @route   POST /api/auth/register
// @access  Publico
const registerUser = async (req, res) => {
    try {
        const { username, name, email, password, profileImageUrl, bio } = req.body;

        // Normalización
        const normalizedUsername = username?.trim().toLowerCase();
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedUsername) {
            return res.status(400).json({ message: "El nombre de usuario es obligatorio" });
        }

        if (!normalizedEmail) {
            return res.status(400).json({ message: "El email es obligatorio" });
        }

        if (!password) {
            return res.status(400).json({ message: "La contraseña es obligatoria" });
        }

        // Verificamos si el email ya existe
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        //Verificamos si el username ya existe
        const existingUsername = await User.findOne({ username: normalizedUsername });
        if (existingUsername) {
            return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generamos el Token de verificación
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const vfTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hora

        const user = await User.create({
            username: normalizedUsername,
            name,
            email: normalizedEmail,
            password: hashedPassword,
            profileImageUrl: profileImageUrl || null,
            bio: bio || "",
            role: "member",
            isVerified: false,
            verificationToken,
            vfTokenExpires
        });

        await sendVerificationEmail(user, verificationToken);

        res.status(201).json({
            message: "Usuario registrado. Revisa tu correo para verificar tu cuenta.",
            email: normalizedEmail
        });

    } catch (error) {
        if (error.code === 11000) {
            if (error.keyPattern?.username) {
                return res.status(400).json({ message: "El nombre de usuario ya esta en uso" });
            }
            if (error.keyPattern?.email) {
                return res.status(400).json({ message: "El email ya esta registrado" });
            }
        }
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }
};

module.exports = { registerUser };