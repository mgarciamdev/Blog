const express = require("express");
const { createAdmin } = require("../controllers/superadmin/superAdmin.controller");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorizeMiddleware");

const router = express.Router();

// Creación de Admin
router.post(
    "/admin",
    protect,
    authorize("superadmin"),
    createAdmin
);

module.exports = router;