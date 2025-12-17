const superadminOnly = (req, res, next) => {
    if (req.user && req.user.role === "superadmin") {
        return next();
    }

    return res.status(403).json({ message: "Acceso solo para superadmin" });
};

module.exports = { superadminOnly };
