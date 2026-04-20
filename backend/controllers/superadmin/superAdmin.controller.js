const User = require("../../models/User");
const bcrypt = require("bcryptjs");

// @desc    Create a new admin
// @route   Post /api/superadmin/admin
// @access  Private (Superadmin Only)
const createAdmin = async (req, res) => {
    try {
        const { username, name, email, password, bio, profileImageUrl } = req.body;

        if (!username || !email || !password) {
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
                message: "Email ya registrado" 
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

module.exports = { createAdmin };