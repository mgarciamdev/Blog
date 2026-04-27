const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/dashboard.controller");
const { protect } = require("../middlewares/authMiddleware");

router.get(
    "/",
    protect,
    getDashboard
);

module.exports = router;