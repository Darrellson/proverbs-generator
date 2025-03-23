const express = require('express');
const { uploadProverbsFile, getProverbs, getRandomProverb, createProverb, deleteProverb, updateProverb } = require('../controllers/proverbController');
const { authenticateToken, isAdmin } = require('../middlewares/authenticate');

const router = express.Router();

router.get("/", getProverbs);
router.get("/random", getRandomProverb);
router.post("/", authenticateToken, isAdmin, createProverb);
router.delete("/:id", authenticateToken, isAdmin, deleteProverb);
router.put("/:id", authenticateToken, isAdmin, updateProverb);

// Route to handle file upload
router.post('/upload', authenticateToken, isAdmin, uploadProverbsFile);

module.exports = router;
