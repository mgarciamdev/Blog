const User = require("../../models/User");

// @desc    Logout User
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Revocamos la sesión
        user.refreshToken = null;
        await user.save();

        res.json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al cerrar la sesión" });
    }
};

module.exports = { logoutUser };