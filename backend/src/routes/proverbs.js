const express = require("express");
const {
  insertProverbs,
  getRandomProverb,
  getProverbs,
  deleteProverb,
  createProverb,
} = require("../controllers/proverbController");
const { authenticate } = require("../middlewares/authenticate");

const router = express.Router();

router.get("/", authenticate, getRandomProverb);
router.post("/insert", authenticate, insertProverbs);
router.get("/proverbs", authenticate, getProverbs);
router.delete("/:id", authenticate, deleteProverb);
router.post("/", authenticate, createProverb);

module.exports = router;
