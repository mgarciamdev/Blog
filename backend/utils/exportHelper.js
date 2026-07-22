const dayjs = require("dayjs")
require("dayjs/locale/es");

dayjs.locale("es");

// Convertir el rol interno a un nombre legible
const formatRole = (role) => {
    switch (role) {
        case "superadmin":
            return "Super Administrador"
        
        case "admin":
            return "Administrador"
        
        case "member":
            return "Miembro"
    
        default:
            return "Desconocido";
    }
};

// Estado de verificación
const formatVerification = (isVerified) => {
    return isVerified
        ? "Verificado"
        : "No verificado"
};

// Estado de moderación
const formatModerationStatus = (isBanned, activeStrikePoints) => {
    if (isBanned) {
        return "Baneado";
    }

    if (activeStrikePoints >= 2) {
        return "Riesgo Alto";
    }

    if (activeStrikePoints >= 1) {
        return "En Peligro";
    }

    return "Perfecto";
};

// Fecha larga - 19 abril 2026 - 12:31
const formatDate = (date) => {
    if (!date) return "-";

    return dayjs(date).format("DD MMMM YYYY - HH:mm");
};

// Fecha Corta - 19/04/2026
const formatShortDate = (date) => {
    if (!date) return "-";

    return dayjs(date).format("DD/MM/YYYY");
};

// Fecha y hora para nombres de archivos - 2026-04-19_12-31-15
const formatFileDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD_HH-mm-ss");
};

const formatBoolean = (value) => {

    return value
        ? "Sí"
        : "No";

};

module.exports = {
    formatRole,
    formatVerification,
    formatModerationStatus,
    formatDate,
    formatShortDate,
    formatFileDate,
    formatBoolean
};