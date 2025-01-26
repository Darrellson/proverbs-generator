const express = require("express");
const { register, login, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login); // Use the actual `login` controller
router.post("/logout", logout);

module.exports = router;
