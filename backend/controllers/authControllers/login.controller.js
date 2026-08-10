const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const isUserBanned = require("../../utils/isUserBanned");
const { generateAccessToken, generateRefreshToken } = require("../../utils/generateToken");

// @desc    Login Users
// @route   POST /api/auth/login
// @access  Public 
const loginUser = async (req, res) => {
    try {
        const { email, password, loginType } = req.body;

        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({ message: "Email y contraseña son obligatorios" });
        }

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            // revisamos si existe una cuenta ELIMINADA con este email
            const deletedUser = await User.findOneIncludingDeleted({ email: normalizedEmail });

            if (deletedUser?.isDeleted) {
                const isMatch = await bcrypt.compare(password, deletedUser.password);

                if (isMatch) {
                    return res.status(403).json({
                        message: "Esta cuenta fue eliminada. Puedes reactivarla.",
                        accountDeleted: true,
                    });
                }
            }

            return res.status(400).json({ message: "Email o contraseña invalidos" });
        }

        if (loginType === "admin" && user.role === "member") {
            return res.status(403).json({
                message: "No tienes acceso como admin"
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: "Debes verificar tu email antes de iniciar la sesión" });
        }

        // Comparamos la contraseña
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Email o contraseña invalidos" });
        }

        // Verificamos si está baneado
        const ban = await isUserBanned(user._id);

        // Tokens
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        // Guardamos el refresh Token
        user.refreshToken = refreshToken;
        await user.save();

        // Regresamos los datos del usuario con el JWT
        res.json({
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
                bio: user.bio,
                role: user.role,
            },
            accessToken,
            refreshToken,
            isBanned: !!ban,
            banInfo: ban || null
        });

    } catch (error) {
        res.status(500).json({ message: "Error del Servidor", error: error.message });
    }
};

module.exports = { loginUser };