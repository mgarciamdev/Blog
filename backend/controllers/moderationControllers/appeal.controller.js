const Appeal = require("../../models/Appeal");
const User = require("../../models/User")
const Strike = require("../../models/Strike");
const Ban = require("../../models/Ban");

// @desc    Crear apelación
// @route   POST /api/moderation/appeals
// @access  Private (member)
const createAppeal = async (req, res) => {
    try {
        const { strikeId, banId, message } = req.body;

        // Validamos
        if (!strikeId && !banId) {
            return res.status(400).json({
                message: "Debes enviar strikeId o banId",
            });
        }

        if (strikeId && banId) {
            return res.status(400).json({
                message: "No puedes apelar strike y ban al mismo tiempo",
            });
        }

        // Evitar apelaciones duplicadas activas
        const existingAppeal = await Appeal.findOne({
            user: req.user._id,
            status: "pendiente",
            $or: [
                strikeId ? { strike: strikeId } : null,
                banId ? { ban: banId } : null,
            ].filter(Boolean), // limpia nulls
        });

        if (existingAppeal) {
            return res.status(400).json({
                message: "Ya tienes una apelación pendiente para este caso",
            });
        }

        let reasonSnapshot = "";

        // Si es STRIKE
        if (strikeId) {
            const strike = await Strike.findById(strikeId);

            if (!strike) {
                return res.status(404).json({ message: "Strike no encontrado" });
            }

            // Validación de propiedad (Muy importante)
            if (strike.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    message: "No puedes apelar este strike",
                });
            }

            reasonSnapshot = strike.reason;
        }

        // Si es BAN
        if (banId) {
            const ban = await Ban.findById(banId);

            if (!ban) {
                return res.status(404).json({ message: "Ban no encontrado" });
            }

            // Validación de propiedad
            if (ban.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    message: "No puedes apelar este ban",
                });
            }

            reasonSnapshot = ban.reason;
        }

        const appeal = await Appeal.create({
            user: req.user._id,
            strike: strikeId || null,
            ban: banId || null,
            message,
            reasonSnapshot,
        });

        res.status(201).json({
            message: "Apelación enviada correctamente",
            appeal,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al crear la apelación",
            error: error.message,
        });
    }
};

// @desc    Obtengo mis apelaciones realizadas
// @route   GET /api/moderation/appeals/me
// @access  Private (member)
const getMyAppeals = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;

        const pageNumber = Math.max(1, parseInt(page));
        const limitNumber = Math.min(50, parseInt(limit));

        let filter = {
            user: req.user._id,
        };

        // Búsqueda (solo texto)
        if (search) {
            filter.$or = [
                { reasonSnapshot: { $regex: search, $options: "i" } },
                { message: { $regex: search, $options: "i" } },
            ];
        }

        const total = await Appeal.countDocuments(filter);

        const appeals = await Appeal.find(filter)
            .populate("strike", "points status")
            .populate("ban", "type expiresAt isActive")
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.json({
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            limit: limitNumber,
            appeals,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener tus apelaciones",
            error: error.message,
        });
    }
};

// @desc    Ver las apelaciones
// @route   GET /api/moderation/appeals
// @access  Private (admin | superadmin)
const getAllAppeals = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, search } = req.query;

        const pageNumber = Math.max(1, parseInt(page));
        const limitNumber = Math.min(50, parseInt(limit));

        let filter = {};

        // Filtro opcional por estado
        if (status) {
            filter.status = status; // pendiente | aceptada | rechazada
        }

        // Búsqueda avanzada
        if (search) {
            // Buscar usuarios
            const users = await User.find({
                $or: [
                    { username: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            }).select("_id");

            const userIds = users.map(u => u._id);

            filter.$or = [
                ...(userIds.length ? [{ user: { $in: userIds } }] : []),
                { reasonSnapshot: { $regex: search, $options: "i" } },
                { message: { $regex: search, $options: "i" } },
            ];
        }

        const total = await Appeal.countDocuments(filter);

        const appeals = await Appeal.find(filter)
            .populate("user", "username email role")
            .populate("resolvedBy", "username role")
            .populate("strike", "points status")
            .populate("ban", "type expiresAt isActive")
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.json({
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            limit: limitNumber,
            appeals,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las apelaciones",
            error: error.message,
        });
    }
};

// @desc    Resolver apelación
// @route   PATCH /api/moderation/appeals/:appealId
// @access  Private (admin | superadmin)
const resolveAppeal = async (req, res) => {
    try {
        const { appealId } = req.params;
        const { action } = req.body; // "aceptar" | "rechazar"

        // Validamos la acción
        if (!["aceptar", "rechazar"].includes(action)) {
            return res.status(400).json({
                message: "Acción inválida",
            });
        }

        const appeal = await Appeal.findById(appealId);

        if (!appeal) {
            return res.status(404).json({
                message: "Apelación no encontrada"
            });
        }

        if (appeal.status !== "pendiente") {
            return res.status(400).json({
                message: "Esta apelación ya fue resuelta",
            });
        }

        // evitar auto-resolución (admin no se puede quitar a si mismo un ban o strike tiene que ser otro)
        if (appeal.user.toString() === req.user._id.toString()) {
            return res.status(403).json({
                message: "No puedes resolver tu propia apelación"
            });
        }

        //____________________//
        //  ACEPTAR APELACIÓN //
        //____________________//
        if (action === "aceptar") {
            // Si es Strike
            if (appeal.strike) {
                const strike = await Strike.findById(appeal.strike);

                if (strike && strike.status !== "revocado") {
                    strike.status = "revocado";
                    await strike.save();
                }
            }

            // Si es Ban
            if (appeal.ban) {
                const ban = await Ban.findById(appeal.ban);

                if (ban && ban.isActive) {
                    ban.isActive = false;
                    await ban.save();

                    await User.findByIdAndUpdate(ban.user, {
                        isBanned: false
                    });
                }
            }

            appeal.status = "aceptada";
        }

        //____________________//
        //  RECHAZAR APELACIÓN //
        //____________________//
        if (action === "rechazar") {
            appeal.status = "rechazada";
        }

        appeal.resolvedBy = req.user._id;
        appeal.resolvedAt = new Date();

        await appeal.save();

        res.json({
            message: "Apelación resuelta correctamente",
            appeal: {
                id: appeal._id,
                status: appeal.status,
                action,
                type: appeal.strike ? "strike" : "ban",
                reason: appeal.reasonSnapshot,
                resolvedAt: appeal.resolvedAt,
            },
            unbanned: !!appeal.ban,
            strikeRevoked: !!appeal.strike
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al resolver la apelación",
            error: error.message,
        });
    }
};

module.exports = { createAppeal, getMyAppeals, getAllAppeals, resolveAppeal };