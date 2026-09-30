const express = require("express");
const { registerUser, loginUser, getAllUsers, deleteUser, updateUser } = require('../controllers/user.controller')
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const findUser = require('../middleware/findUser.middleware');


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get(
    "/admin/users",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);
router.delete("/admin/users/:id", authMiddleware, adminMiddleware, findUser, deleteUser)
router.patch("/admin/users/:id", authMiddleware, adminMiddleware, findUser, updateUser)


module.exports = router