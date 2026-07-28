const User = require("../../models/User");
const { calculateActiveStrikePoints } = require("../moderation.service");
const csvExporter = require("./exporters/csvExporter");
const excelExporter = require("./exporters/excelExporter");
const pdfExporter = require("./exporters/pdfExporter");
const { formatRole, formatVerification, formatModerationStatus, formatDate } = require("../../utils/exportHelper");

const exportUsersService = async (format, currentUser) => {

    const enrichUsers = async (users) => {
        return Promise.all(
            users.map(async (user) => {
                const activeStrikePoints = await calculateActiveStrikePoints(user._id);

                return {
                    ...user,
                    activeStrikePoints
                };
            })
        );
    }

    // Obtener usuarios ordenados por fecha
    const users = await User.find({})
        .select("-password")
        .sort({ createdAt: -1 })
        .lean();

    const enrichedUsers = await enrichUsers(users);

    // Datos listos para exportación
    const normalizedUsers = enrichedUsers.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        role: formatRole(user.role),
        verified: formatVerification(user.isVerified),
        banned: formatModerationStatus(user.isBanned, user.activeStrikePoints),
        strikes: user.activeStrikePoints,
        createdAt: formatDate(user.createdAt),
    }));

    switch (format) {
        case "csv":
            return csvExporter(normalizedUsers);

        case "xlsx":
            return excelExporter(
                normalizedUsers,
                currentUser
            );

        case "pdf":
            return pdfExporter(
                normalizedUsers,
                currentUser.name
            );

        default:
            throw new Error("Formato no soportado");
    }
};

module.exports = exportUsersService;