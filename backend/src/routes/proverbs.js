const express = require("express");
const { getRandomProverb } = require("../controllers/proverbController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getRandomProverb);

module.exports = router;
