require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db.config");
const { schedulePurgeJob } = require("./jobs/purgeAccounts.job");
const { globalLimiter } = require("./middlewares/rateLimiter");

const authRoutes = require("./routes/auth.routes");
const moderationRoutes = require("./routes/moderation.routes");
const superAdminRoutes = require("./routes/superadmin.routes");
const adminRoutes = require("./routes/admin.routes");
const blogPostRoutes = require("./routes/blogPost.routes");
const commentRoutes = require("./routes/comment.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const aiRoutes = require("./routes/ai.routes");
const uploadRoutes = require("./routes/upload.routes");
const userRoutes = require("./routes/user.routes");
const feedbackRoutes = require("./routes/feedback.routes");

const app = express();

app.set("trust proxy", 1); // necesario en Render

// Middleware para manejar CORS
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Content-Disposition"],
    })
);

// Middleware
app.use(express.json());
app.use(globalLimiter);

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/moderation", moderationRoutes);
app.use("/api/posts", blogPostRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);

// Server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Inicializamos el Servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {

    await connectDB();

    schedulePurgeJob();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

};

startServer();