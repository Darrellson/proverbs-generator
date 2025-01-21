const express = require('express');
const { getRandomProverb, insertProverbs, getProverbs } = require('../controllers/proverbController');
const { authenticate } = require('../middlewares/authenticate');
const router = express.Router();

// Route to fetch a random proverb
router.get('/', authenticate, getRandomProverb);

// Route to insert proverbs from the request body
router.post("/insert", authenticate, async (req, res) => {
  try {
    await insertProverbs(req, res); // Pass req and res directly to insertProverbs function
  } catch (error) {
    res.status(500).json({ error: 'Error inserting proverbs' });
  }
});

// Route to fetch all proverbs
router.get('/proverbs', authenticate, getProverbs);

module.exports = router;
