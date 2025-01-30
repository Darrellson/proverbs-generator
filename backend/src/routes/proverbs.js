const express = require("express");
const { getProverbs, getRandomProverb, createProverb, deleteProverb } = require("../controllers/proverbController");
const { authenticateToken, isAdmin } = require("../middlewares/authenticate");

const router = express.Router();

router.get("/", getProverbs);
router.get("/random", getRandomProverb);
router.post("/", authenticateToken, isAdmin, createProverb);
router.delete("/:id", authenticateToken, isAdmin, deleteProverb);

module.exports = router;
