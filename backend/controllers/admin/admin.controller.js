const User = require("../../models/User");
const { getModerationStatsByUser } = require("../../services/moderation.service");

// @desc    Get user (admin view)
// @route   GET /api/admin/users/:id
// @access  Private (admin | superadmin)
const getUserByIdAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select(
                "username name email role isVerified isDeleted createdAt lastUsernameChange lastLogin"
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
// @route   DELETE /api/users/:userId
// @access  Private (admin | superadmin)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const userToDelete = await Userser.findById(userId);

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
            .select("-password -refreshToken")
            .sort({ [sortField]: -1 })
            .skip(skip)
            .limit(limitNumber);

        res.json({
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            results: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener usuarios",
            error: error.message
        });
    }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:userId/role
// @access  Private (admin | superadmin)
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const allowedRoles = ["member", "admin", "superadmin"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Rol inválido"
            });
        }

        if (req.user._id.toString() === id) {
            return res.status(400).json({
                message: "No puedes cambiar tu propio rol"
            });
        }

        const userToUpdate = await User.findById(id);

        if (!userToUpdate) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        if (userToUpdate.role === "superadmin") {
            return res.status(403).json({
                message: "No puedes modificar un superadmin"
            });
        }

        // Reglas para admin
        if (req.user.role === "admin") {
            if (role === "superadmin") {
                return res.status(403).json({
                    message: "No puedes asignar superadmin"
                });
            }

            if (userToUpdate.role === "admin") {
                return res.status(403).json({
                    message: "No puedes modificar otro admin"
                });
            }
        }

        userToUpdate.role = role;
        await userToUpdate.save();

        res.json({
            message: "Rol actualizado correctamente",
            user: {
                id: userToUpdate._id,
                username: userToUpdate.username,
                role: userToUpdate.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar rol",
            error: error.message
        });
    }
};

module.exports = {
    getUserByIdAdmin,
    deleteUser,
    getAllUsers,
    updateUserRole
};