const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const createAdmin = async (req, res) => {
    try {
        const { username, name, email, password, bio, profileImageUrl } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Datos incompletos" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Email ya registrado" });
        }

        let role = "admin";

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await User.create({
            username: username.toLowerCase(),
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            profileImageUrl: profileImageUrl || null,
            bio: bio || "",
            role,
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
            message: "Error del servidor", error
        });
    }
};

module.exports = { createAdmin };