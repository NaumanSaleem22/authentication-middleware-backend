const express = require("express");
const { registerUser, loginUser, getAllUsers } = require('../controllers/user.controller')

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);

module.exports = router