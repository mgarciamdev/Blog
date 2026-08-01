export const canManageUser = (currentUser, targetUser) => {
    if (!currentUser || !targetUser) return false;

    // Nunca permitir eliminarse/editarse a sí mismo
    if (currentUser._id === targetUser._id) {
        return false;
    }

    switch (currentUser.role) {
        case "superadmin":
            // Puede administrar a todos
            return true;

        case "admin":
            // Solo puede administrar members
            return targetUser.role === "member";
    
        default:
            return false;
    }
};

export const canExportDataReport = (currentUser) => {
    if (!currentUser) return false;

    return (
        currentUser.role === "superadmin" || currentUser.role === "admin"
    );
};

export const canCreateAdmin = (currentUser) => {
    return currentUser?.role === "superadmin";
};

export const canDeleteUser = (currentUser, targetUser) => {
    return canManageUser(currentUser, targetUser);
};

export const canEditUser = (currentUser, targetUser) => {
    return canManageUser(currentUser, targetUser);
};

export const canExportReport = (currentUser) => {
    return canExportDataReport(currentUser);
};