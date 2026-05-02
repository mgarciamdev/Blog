const { GoogleGenAI } = require("@google/genai");
const {
    generateBlogPostPrompt,
    blogPostIdeasPrompt,
    generateReplyPrompt,
    blogSummaryPrompt
} = require("../utils/prompts");

const { validateInputSize } = require("../utils/validateInputSize");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Generar contenido de blog por titulo
// @route   POST /api/ai/generate
// @access  Private
const generateBlogPost = async (req, res) => {
    try {
        const { title, tone } = req.body;

        if (!title || !tone) {
            return res.status(400).json({
                message: "Título y tono son requeridos"
            });
        }

        if (!validateInputSize(title, 200)) {
            return res.status(400).json({
                message: "El título es demasiado largo"
            });
        }

        const prompt = generateBlogPostPrompt({ title, tone });

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            generationConfig: {
                maxOutputTokens: 1200,
                temperature: 0.7
            }
        });

        const rawText =
            response.text ||
            response.candidates?.[0]?.content?.parts?.[0]?.text || "";

        res.status(200).json({
            title,
            tone,
            content: rawText
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al generar post para el blog",
            error: error.message
        });
    }
};

// @desc    Generar ideas de contenido para el blog a partir del título
// @route   POST /api/ai/generate-ideas
// @access  Private (admin | superadmin)
const generateBlogPostIdeas = async (req, res) => {
    try {
        const { topics } = req.body;

        if (!topics) {
            return res.status(400).json({
                message: "Falta tema requerido"
            });
        }

        if (!validateInputSize(topics, 500)) {
            return res.status(400).json({
                message: "El tema es demasiado largo"
            });
        }

        const prompt = blogPostIdeasPrompt(topics.trim());

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            generationConfig: {
                maxOutputTokens: 400,
                temperature: 0.7
            }
        });

        const text =
            response.text ||
            response.candidates?.[0]?.content?.parts?.[0]?.text ||
            "";

        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            console.error("Error parseando IA:", err);
            return res.status(500).json({
                message: "Formato de respuesta IA invalido",
                raw: text
            });
        }

        res.json(data);

    } catch (error) {
        res.status(500).json({
            message: "Error al generar ideas",
            error: error.message
        });
    }
};

// @desc    Generar respuesta de comentario
// @route   POST /api/ai/generate-reply
// @access  Private (admin | superadmin)
const generateCommentReply = async (req, res) => {
    try {
        const { author, content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "El contenido es requerido"
            });
        }

        if (!validateInputSize(content, 500)) {
            return res.status(400).json({
                message: "El comentario es demasiado largo"
            });
        }

        const prompt = generateReplyPrompt({
            author,
            content: content.trim()
        });

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            generationConfig: {
                maxOutputTokens: 150,
                temperature: 0.7
            }
        });

        const reply =
            response.text ||
            response.candidates?.[0]?.content?.parts?.[0]?.text ||
            "";

        res.json({
            reply
        });

    } catch (error) {
        res.status(500).json({
            message: "Fallo al generar respuesta",
            error: error.message
        });
    }
};

// @desc    Generar resumen del post
// @route   POST /api/ai/generate-summary
// @access  Private (admin | superadmin)
const generatePostSummary = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                message: "El contenido es requerido"
            });
        }

        if (!validateInputSize(content, 5000)) {
            return res.status(400).json({
                message: "El contenido es demasiado largo"
            });
        }

        const prompt = blogSummaryPrompt(content.trim());

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.5
            }
        });

        const text =
            response.text ||
            response.candidates?.[0]?.content?.parts?.[0]?.text ||
            "";

        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            console.error("Error parseando IA:", err);
            return res.status(500).json({
                message: "Formato de respuesta IA invalido",
                raw: text
            });
        }

        res.json(data);

    } catch (error) {
        res.status(500).json({
            message: "Fallo al generar resumen",
            error: error.message
        });
    }
};

module.exports = {
    generateBlogPost,
    generateBlogPostIdeas,
    generateCommentReply,
    generatePostSummary
};