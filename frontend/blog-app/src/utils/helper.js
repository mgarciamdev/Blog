export const getInitials = (title) => {
    if (!title) return "";

    const words = title.split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
};

export const isAdminRole = (role) => {
    return ["admin", "superadmin"].includes(role);
};

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const roleStyles = {
    superadmin: {
        label: "System",
        className: "bg-red-100 text-red-700",
    },
    admin: {
        label: "Admin",
        className: "bg-emerald-100 text-emerald-700",
    },
    member: {
        label: "Member",
        className: "bg-sky-100 text-sky-700",
    },
};

export const roleAvatarStyles = {
    superadmin: "ring-red-200",
    admin: "ring-emerald-200",
    member: "ring-sky-200",
};

export const getToastMessagesByType = (type) => {
    switch (type) {
        case "edit":
            return "Publicación de blog actualizada exitosamente";
        case "draft":
            return "Entrada de blog guardada como borrador correctamente";
        case "published":
            return "Publicación de blog publicada con éxito";

        default:
            return "Publicación de blog publicada con éxito";
    }
};