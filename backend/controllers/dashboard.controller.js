const {
    getAdminDashboard,
    getSuperAdminDashboard,
    getMemberDashboard
} = require("../services/dashboard.service");

// @desc    Get dashboard data (dynamic by role)
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res) => {
    try {
        const role = req.user.role;

        let data;

        if (role === "superadmin") {
            data = await getSuperAdminDashboard();
        } else if (role === "admin") {
            data = await getAdminDashboard();
        } else {
            data = await getMemberDashboard(req.user._id);
        }

        res.json({
            role,
            ...data
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el dashboard",
            error: error.message
        });
    }
};

module.exports = { getDashboard };