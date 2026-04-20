# 📊 Dashboard Unificado (Arquitectura)

## 🎯 Objetivo
Unificar los dashboards de **member, admin y superadmin** en un solo endpoint inteligente, evitando duplicación de lógica y facilitando el mantenimiento.

---

## 🚀 Endpoint
GET /api/dashboard

### 🔐 Acceso
- Requiere autenticación (`protect`)
- Disponible para todos los roles:
  - member
  - admin
  - superadmin

---

## 🧠 Arquitectura
Controller → maneja request/response
Service → contiene lógica de negocio

---

## 🧩 Controller

---

const {
    getUserStats,
    getAdminStats,
    getSuperAdminStats,
    getRecentActivity,
    getModerationStatsForDashboard,
} = require("./dashboard.service");

const roleHandlers = {
    member: getUserStats,
    admin: getAdminStats,
    superadmin: getSuperAdminStats,
};

const getDashboard = async (req, res) => {
    try {
        const user = req.user;

        const profile = {
            _id: user._id,
            username: user.username,
            role: user.role,
        };

        const handler = roleHandlers[user.role];

        const stats = handler
            ? await handler(user._id)
            : {};

        const recentActivity = await getRecentActivity(
            user._id,
            user.role
        );

        let moderation = null;

        if (["admin", "superadmin"].includes(user.role)) {
            moderation = await getModerationStatsForDashboard();
        }

        res.json({
            profile,
            stats,
            recentActivity,
            moderation,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener dashboard",
            error: error.message,
        });
    }
};

module.exports = { getDashboard };

---

## Service

---

const User = require("../../models/User");
const Ban = require("../../models/Ban");
const Strike = require("../../models/Strike");

const getUserStats = async (userId) => {
    const strikes = await Strike.countDocuments({ user: userId });

    const activeBans = await Ban.countDocuments({
        user: userId,
        isActive: true,
    });

    return {
        strikes,
        activeBans,
    };
};

const getAdminStats = async () => {
    const totalUsers = await User.countDocuments();
    const totalBans = await Ban.countDocuments();
    const activeBans = await Ban.countDocuments({ isActive: true });

    return {
        totalUsers,
        totalBans,
        activeBans,
    };
};

const getSuperAdminStats = async () => {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalBans = await Ban.countDocuments();
    const totalStrikes = await Strike.countDocuments();

    return {
        totalUsers,
        totalAdmins,
        totalBans,
        totalStrikes,
        systemStatus: "OK",
    };
};

const getRecentActivity = async (userId, role) => {
    if (role === "member") {
        return await Strike.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5);
    }

    if (role === "admin" || role === "superadmin") {
        return await Ban.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "username")
            .populate("bannedBy", "username");
    }

    return [];
};

const getModerationStatsForDashboard = async () => {
    const totalBans = await Ban.countDocuments();
    const activeBans = await Ban.countDocuments({ isActive: true });
    const totalStrikes = await Strike.countDocuments();

    return {
        totalBans,
        activeBans,
        totalStrikes,
    };
};

module.exports = {
    getUserStats,
    getAdminStats,
    getSuperAdminStats,
    getRecentActivity,
    getModerationStatsForDashboard,
};

---