const express = require("express");
const {
  register,
  login,
  logout,
  refreshToken,
  isAdmin,
} = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authenticate");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/isAdmin", authenticateToken, isAdmin);

router.post("/refresh-token", refreshToken);

module.exports = router;
