const Feedback = require("../../models/Feedback");
const User = require("../../models/User");
const { sendFeedbackResponseEmail } = require("../../utils/emailHelper");

// @desc    Crear un nuevo feedback por parte del usuario
// @route   POST /api/feedback
// @access  Private (Member)
const createFeedback = async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, message, category } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({
                message: "El mensaje es obligatorio"
            });
        }

        const feedback = await Feedback.create({
            sender: userId,
            title: title?.trim() || "",
            message: message.trim(),
            category
        });

        res.status(201).json({
            message: "Feedback enviado correctamente",
            feedback
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al enviar feedback",
            error: error.message
        });
    }
};

// @desc    Obtener todos los feedbacks (con filtros y paginación)
// @route   GET /api/feedback
// @access  Private (Admin | Superadmin)
const getReceivedFeedbacks = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, status } = req.query;

        const pageNumber = Math.max(1, parseInt(page) || 1);
        const limitNumber = Math.min(10, parseInt(limit) || 10);
        const skip = (pageNumber - 1) * limitNumber;

        const query = {};

        if (category) query.category = category;
        if (status) query.status = status;

        const feedbacks = await Feedback.find(query)
            .populate("sender", "username name email profileImageUrl")
            .populate("response.responder", "name email profileImageUrl")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)

        const total = await Feedback.countDocuments(query);

        res.json({
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            results: feedbacks.length,
            feedbacks
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener feedbacks"
        });
    }
};

// @desc    Marcar feedback como leído (cambiar status a "read")
// @route   PUT /api/feedback/:id/read
// @access  Private (Admin | Superadmin)
const markFeedbackAsRead = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback no encontrado"
            });
        }

        if (feedback.status === "pending") {
            feedback.status = "read";
            await feedback.save();
        }

        res.json({
            message: "Feedback marcado como leído",
            feedback
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar feedback",
            error: error.message
        });
    }
};

// @desc    Responder a un feedback de usuario
// @route   PUT /api/feedback/:id/respond
// @access  Private (Admin | Superadmin)
const respondFeedback = async (req, res) => {
    try {
        const { content } = req.body;
        const adminId = req.user._id;

        if (!content || content.trim() === "") {
            return res.status(400).json({
                message: "El contenido de la respuesta es obligatorio"
            });
        }

        const feedback = await Feedback.findById(req.params.id)
            .populate("sender", "email name username profileImageUrl");

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback no encontrado"
            });
        }

        // validar si fue respondido
        if (feedback.status === "responded") {
            return res.status(400).json({
                message: "Este feedback ya fue respondido"
            });
        }

        // Guardamos respuesta
        feedback.response = {
            content: content.trim(),
            responder: adminId,
            respondedAt: new Date()
        };

        // actualizar estado
        feedback.status = "responded";

        await feedback.save();

        // enviar email
        try {
            await sendFeedbackResponseEmail(
                feedback.sender,
                feedback,
                content
            );
        } catch (emailError) {
            console.error("Error enviando email:", emailError.message);
        }

        res.json({
            message: "Feedback respondido correctamente",
            feedback
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al responder feedback",
            error: error.message
        });
    }
};

// @desc    Eliminar un feedback
// @route   DELETE /api/feedback/:id
// @access  Private (Admin | Superadmin)
const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback no encontrado"
            });
        }

        await feedback.deleteOne();

        res.json({
            message: "Feedback eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar feedback",
            error: error.message
        });
    }
};

// @desc    Obtener cantidad de feedbacks pendientes (no leídos)
// @route   GET /api/feedback/unread-count
// @access  Private (Admin | Superadmin)
const getUnreadCount = async (req, res) => {
    try {
        const count = await Feedback.countDocuments({
            status: "pending"
        });

        res.json({
            unreadCount: count
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener conteo de feedbacks",
            error: error.message
        });
    }
};

// @desc    Obtener feedbacks del usuario con sus respuestas
// @route   GET /api/feedback/my-feedbacks
// @access  Private (Member)
const getFeedbackResponse = async (req, res) => {
    try {
        const userId = req.user._id;

        // filtros opcionales
        const { onlyResponded, status } = req.query;

        const query = {
            sender: userId
        };

        // solo feedback respondidos
        if (onlyResponded === "true") {
            query.status = status;
        }

        // filtro dinámico por status
        if (status) {
            query.status = status;
        }

        const feedbacks = await Feedback.find(query)
            .populate("response.responder", "name email profileImageUrl")
            .sort({ createdAt: -1 });

        res.json({
            total: feedbacks.length,
            feedbacks
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener feedbacks del usuario",
            responded: feedbacks.filter(f => f.status === "responded").length,
            pending: feedbacks.filter(f => f.status === "pending").length,
            error: error.message
        });
    }
};

module.exports = {
    createFeedback,
    getReceivedFeedbacks,
    markFeedbackAsRead,
    respondFeedback,
    deleteFeedback,
    getUnreadCount,
    getFeedbackResponse
};