const express = require("express");
const {
  getProverbs,
  getRandomProverb,  // <-- Add this function
  createProverb,
  deleteProverb,
} = require("../controllers/proverbController");

const router = express.Router();

router.get("/", getProverbs);
router.get("/random", getRandomProverb);  // <-- Add this route
router.post("/", createProverb);
router.delete("/:id", deleteProverb);

module.exports = router;
