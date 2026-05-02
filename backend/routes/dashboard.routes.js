const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/dashboard.controller");
const { protect } = require("../middlewares/authMiddleware");
const { checkBan } = require("../middlewares/banMiddleware");

router.get(
    "/",
    protect,
    checkBan,
    getDashboard
);

module.exports = router;