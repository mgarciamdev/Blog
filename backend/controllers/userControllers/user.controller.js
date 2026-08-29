const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const { sendPasswordChangeEmail } = require("../../utils/emailHelper");

const SAFE_USER_FIELDS = "-password -refreshToken -verificationToken -vfTokenExpires -resetPasswordToken -resetPasswordExpires -isDeleted -deletedAt -__v";

const getSanatizedUser = (userId) => User.findById(userId).select(SAFE_USER_FIELDS);

// @desc    Get my profile
// @route   GET /api/users/profile
// @access  Private
const getMyProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await getSanatizedUser(userId);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        res.json({
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el perfil",
            error: error.message
        });
    }
};

// @desc    Update my profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        let { name, bio, profileImageUrl } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        // limpiamos
        if (name) name = name.trim();
        if (bio) bio = bio.trim();

        // evitamos strings vacios
        if (name === "") name = undefined;
        if (bio === "") bio = undefined;

        // Validamos
        if (name && name.length > 50) {
            return res.status(400).json({
                message: "El nombre no puede exceder 50 caracteres"
            });
        }

        if (bio && bio.length > 200) {
            return res.status(400).json({
                message: "La biografía no puede exceder 200 caracteres"
            });
        }

        // actualización
        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (profileImageUrl) user.profileImageUrl = profileImageUrl;

        await user.save();

        const updateUser = await getSanatizedUser(user._id);

        res.json({
            message: "Perfil actualizado",
            user: updateUser
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el perfil",
            error: error.message
        });
    }
};

// // @desc    Get user public profile by id
// // @route   GET /api/users/:id
// // @access  Public
// const getUserById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const user = await User.findById(id)
//             .select("username name profileImageUrl bio createdAt");

//         if (!user) {
//             return res.status(404).json({
//                 message: "Usuario no encontrado"
//             });
//         }

//         res.json({
//             user
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Error al obtener usuario"
//         });
//     }
// };

// @desc    Actualizar contraseña
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        // Verificamos contraseña actual
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Contraseña actual incorrecta"
            });
        }

        // Evitar misma contraseña
        const isSame = await bcrypt.compare(newPassword, user.password);

        if (isSame) {
            return res.status(400).json({
                message: "La nueva contraseña debe ser diferente"
            });
        }

        // logintud de contraseña
        if (newPassword.length < 12) {
            return res.status(400).json({
                message: "La contraseña debe tener al menos 12 caracteres"
            });
        }

        // Hashear nueva contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        user.refreshToken = null; // forzamos re-login en otros dispositivos

        user.lastPasswordChange = Date.now(); // ultimo cambio de contraseña

        await user.save();

        // enviamos email 
        await sendPasswordChangeEmail(user, req);

        res.json({
            message: "Contraseña actualizada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al cambiar la contraseña",
            error: error.message
        });
    }
};

// @desc    Actualizar username
// @route   PUT /api/users/username
// @access  Private
const updateUsername = async (req, res) => {
    try {
        let { username } = req.body;
        const userId = req.user._id;

        // normalizar
        username = username?.trim().toLowerCase();

        if (!username || username.length < 5) {
            return res.status(400).json({
                message: "El username debe tener al menos 5 caracteres"
            });
        }

        const usernameRegex = /^[a-z0-9_]+$/;

        if (!usernameRegex.test(username)) {
            return res.status(400).json({
                message: "Solo se perminet letras, números y _"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        // mismo username
        if (user.username === username) {
            return res.status(400).json({
                message: "El nuevo username no puede ser igual al actual"
            });
        }

        // límite de dias
        const DAYS_LIMIT = 30;
        const now = new Date();

        if (user.lastUsernameChange) {
            const diffDays = (now - new Date(user.lastUsernameChange)) / (1000 * 60 * 60 * 24);

            if (diffDays < DAYS_LIMIT) {
                const remaining = Math.ceil(DAYS_LIMIT - diffDays);

                return res.status(400).json({
                    message: `Puedes cambiar tu username cada ${DAYS_LIMIT} días`,
                    remainingDays: remaining
                });
            }
        }

        // verificamos disponibilidad
        const existingUsername = await User.findOne({
            username,
            _id: { $ne: userId }
        });

        if (existingUsername) {
            return res.status(400).json({
                message: "Este username ya está en uso"
            });
        }

        // actualizar
        user.username = username;
        user.lastUsernameChange = now;

        await user.save();

        const updatedUser = await getSanatizedUser(user._id);

        res.json({
            message: "Username actualizado correctamente",
            user: updatedUser,
            nextAvailableChange: new Date(
                now.getTime() + DAYS_LIMIT * 24 * 60 * 60 * 1000
            )
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el nombre de usuario",
            error: error.message
        });
    }
};

// @desc    Eliminar mi cuenta
// @route   DELETE /api/users/me
// @access  Private
const deleteMyAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Confirmamos identidad
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        user.isDeleted = true;
        user.deletedAt = new Date();
        user.refreshToken = null; // invalida sesiones activas
        
        await user.save();

        res.json({
            message: "Cuenta eliminada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar la cuenta",
            error: error.message
        });
    }
};

// @desc    verificar disponibilidad de nombre de usuario
// @route   GET /api/users/check?username=...
// @access  Public
const checkUsername = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username || username.trim() === "") {
            return res.status(400).json({
                message: "El nombre de usuario es requerido"
            });
        }

        const normalized = username.trim().toLowerCase();

        const user = await User.findOne({
            username: normalized
        });

        if (!user) {
            return res.json({
                available: true,
                message: "El nombre de usuario está disponible"
            });
        }

        // generamos sugerencias limpias
        const base = normalized.replace(/[^a-z0-9]/gi, "") || "user";

        const random = (min, max) =>
            Math.floor(Math.random() * (max - min + 1)) + min;

        const suggestions = [
            `${base}${random(10, 99)}`,
            `${base}_${random(10, 99)}`,
            `${base}${random(1000, 9999)}`,
        ];

        res.json({
            available: false,
            message: "El nombre de usuario ya está en uso",
            suggestions
        });

    } catch (error) {
        res.status(500).json({
            message: "Erro en el servidor",
            error: error.message
        });
    }
};

module.exports = {
    getMyProfile,
    updateProfile,
    // getUserById,
    changePassword,
    updateUsername,
    deleteMyAccount,
    checkUsername
};