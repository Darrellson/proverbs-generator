const express = require('express');
const { getRandomProverb, insertProverbs } = require('../controllers/proverbController');
const { authenticate } = require('../middlewares/authenticate');
const router = express.Router();

// Ensure this is correctly defined
router.get("/random", authenticate, getRandomProverb);

// Route to insert proverbs (for testing)
router.post("/insert", authenticate, async (req, res) => {
  try {
    await insertProverbs();
    res.json({ message: 'Proverbs insertion completed' });
  } catch (error) {
    res.status(500).json({ error: 'Error inserting proverbs' });
  }
});

module.exports = router;
