const User = require("../../models/User");
const bcrypt = require("bcryptjs");

// @desc    Create a new admin
// @route   Post /api/superadmin/admin
// @access  Private (Superadmin Only)
const createAdmin = async (req, res) => {
    try {
        const { username, name, email, password, bio, profileImageUrl } = req.body;

        if (!username || !name || !email || !password) {
            return res.status(400).json({
                message: "Datos incompletos"
            });
        }

        const exists = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (exists) {
            return res.status(400).json({ 
                message: "El email o nombre de usuario ya están registrados" 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await User.create({
            username: username.toLowerCase(),
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            profileImageUrl: profileImageUrl || null,
            bio: bio || "",
            role: "admin",
            isVerified: true,
        });

        res.status(201).json({
            message: "Admin creado exitosamente",
            admin: {
                id: admin._id,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error del servidor"
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

        if (req.user.role !== "superadmin") {
            return res.status(403).json({
                message: "solo un superadmin puede modificar roles"
            });
        }

        if (role === "superadmin") {
            return res.status(403).json({
                message: "No se pueden crear nuevos superadmin"
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

module.exports = { createAdmin, updateUserRole };