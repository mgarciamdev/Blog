const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    getUserByIdAdmin,
    deleteUser,
    updateUserRole
} = require("../controllers/admin/admin.controller");

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorizeMiddleware");

router.use(
    protect, 
    authorize("admin", "superadmin")
);

router.get(
    "/users", 
    getAllUsers
);

router.get(
    "/users/:id",
    getUserByIdAdmin
);

router.delete(
    "/users/:id",
    deleteUser
);

router.patch(
    "/users/:id/role",
    updateUserRole
);

module.exports = router;