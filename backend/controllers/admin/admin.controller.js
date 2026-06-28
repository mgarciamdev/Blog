const User = require("../../models/User");
const { getModerationStatsByUser, calculateActiveStrikePoints } = require("../../services/moderation.service");

// @desc    Get user (admin view)
// @route   GET /api/admin/users/:id
// @access  Private (admin | superadmin)
const getUserByIdAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select(
                "username name email role isVerified createdAt lastUsernameChange"
            );

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

        const userToDelete = await User.findById(id);

        if (!userToDelete) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        // 🔥 evitar eliminar superadmin
        if (userToDelete.role === "superadmin") {
            return res.status(403).json({
                message: "No puedes eliminar un superadmin"
            });
        }

        // 🔥 opcional: evitar que un admin elimine a otro admin
        if (req.user.role === "admin" && userToDelete.role === "admin") {
            return res.status(403).json({
                message: "No puedes eliminar otro admin"
            });
        }

        await userToDelete.deleteOne();

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
        const { page = 1, limit = 10, search = "", role, verified, sort = "createdAt" } = req.query;

        const pageNumber = Math.max(1, parseInt(page) || 1);
        const limitNumber = Math.min(50, parseInt(limit) || 10);
        const skip = (pageNumber - 1) * limitNumber;

        // sort seguro
        const allowedSort = ["createdAt", "username", "email"];
        const sortField = allowedSort.includes(sort) ? sort : "createdAt";

        // filtro base
        const query = {
            isDeleted: { $ne: true }
        };

        // búsqueda
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        // filtro por rol
        if (role) {
            query.role = role;
        }

        // filtro verificación
        if (verified !== undefined) {
            query.isVerified = verified === "true";
        }

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

        res.json({
            message: "Perfil actualizado correctamente",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar perfil",
            error: error.message
        });
    }
};

module.exports = {
    getUserByIdAdmin,
    deleteUser,
    getAllUsers,
    updateUserProfileAdmin
};