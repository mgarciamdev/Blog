const User = require("../../models/User");
const { getModerationStatsByUser, calculateActiveStrikePoints } = require("../../services/moderation.service");
const exportUsersService = require("../../services/export/exportUsers.service");
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc    Get user (admin view)
// @route   GET /api/admin/users/:id
// @access  Private (admin | superadmin)
const getUserByIdAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("username name email role isVerified createdAt lastUsernameChange idDeleted deletedAt");

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        const moderationStats = await getModerationStatsByUser(id);

        res.json({
            user,
            moderationStats
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener usuario",
            error: error.message
        });
    }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private (admin | superadmin)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user._id.toString() === id) {
            return res.status(400).json({
                message: "No puedes eliminar tu propia cuenta desde aquí"
            });
        }

        const userToDelete = await User.findById(id);

        if (!userToDelete) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        // evitar eliminar superadmin
        if (userToDelete.role === "superadmin") {
            return res.status(403).json({
                message: "No puedes eliminar un superadmin"
            });
        }

        // evita que un admin elimine a otro admin
        if (req.user.role === "admin" && userToDelete.role === "admin") {
            return res.status(403).json({
                message: "No puedes eliminar otro admin"
            });
        }

        userToDelete.isDeleted = true;
        userToDelete.deletedAt = new Date();
        userToDelete.deletedBy = req.user._id;
        userToDelete.refreshToken = null;

        await userToDelete.save();

        res.json({
            message: "Usuario eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar usuario",
            error: error.message
        });
    }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private (admin | superadmin)
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", role, status = "all", sort = "createdAt" } = req.query;

        const pageNumber = Math.max(1, parseInt(page) || 1);
        const limitNumber = Math.min(50, Math.max(1, parseInt(limit) || 10));
        const skip = (pageNumber - 1) * limitNumber;

        // sort seguro
        const allowedSort = ["createdAt", "username", "email"];
        const sortField = allowedSort.includes(sort) ? sort : "createdAt";

        // filtro base
        const query = {
            isDeleted: status === "deleted" ? true : { $ne: true },
        };

        const term = String(search).trim();

        if (term) {
            const regex = new RegExp(escapeRegex(term), "i");
            query.$or = [{name: regex}, {username: regex}, {email: regex}];
        }
        
        if (["superadmin", "admin", "member"].includes(role)) {
            query.role = role;
        }

        // búsqueda
        // if (search) {
        //     query.$or = [
        //         { name: { $regex: search, $options: "i" } },
        //         { username: { $regex: search, $options: "i" } },
        //         { email: { $regex: search, $options: "i" } }
        //     ];
        // }

        if (status === "verified") query.isVerified = true;
        if (status === "not_verified") query.isVerified = false;
        if (status === "banned") query.isBanned = true;

        // total
        const total = await User.countDocuments(query);

        // obtener usuarios
        const users = await User.find(query)
            .select("-password -refreshToken -lastPasswordChange -lastUsernameChange -verificationToken -vfTokenExpires -resetPasswordToken -resetPasswordExpires")
            .sort({ [sortField]: -1 })
            .skip(skip)
            .limit(limitNumber);

        const usersWithModeration = await Promise.all(
            users.map(async (user) => {
                const activeStrikePoints = await calculateActiveStrikePoints(user._id);

                return {
                    ...user.toObject(),
                    activeStrikePoints,
                };
            })
        );

        res.json({
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            results: usersWithModeration.length,
            users: usersWithModeration,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener usuarios",
            error: error.message
        });
    }
};

// @desc    Update user profile (admin || superadmin)
// @route   GET /api/admin/users/:id/profile
// @access  Private (admin | superadmin)
const updateUserProfileAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, bio, profileImageUrl } = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        user.name = name ?? user.name;
        user.bio = bio ?? user.bio;
        user.profileImageUrl = profileImageUrl ?? user.profileImageUrl;

        await user.save();

        const safeUser = await User.findById(id).select("-password -refreshToken -verificationToken -vfTokenExpires -resetPasswordToken -resetPasswordExpires ");

        res.json({
            message: "Perfil actualizado correctamente",
            user: safeUser
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar perfil",
            error: error.message
        });
    }
};

// @desc    Export users management list to formats csv, xlsx and pdf
// @route   GET /api/admin/users/export/:format
// @access  Private (admin | superadmin)
const exportUsers = async (req, res) => {
    try {
        const { format } = req.params;

        const allowedFormats = [
            "csv",
            "xlsx",
            "pdf"
        ];

        if (!allowedFormats.includes(format)) {
            return res.status(400).json({
                message: "Formato no soportado"
            });
        }

        const result = await exportUsersService(
            format,
            req.user
        );

        res.setHeader(
            "Content-Type",
            result.contentType
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${result.filename}"`
        );

        return res.send(result.buffer);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Error al exportar usuarios"
        });
    }
};

module.exports = {
    getUserByIdAdmin,
    deleteUser,
    getAllUsers,
    updateUserProfileAdmin,
    exportUsers
};