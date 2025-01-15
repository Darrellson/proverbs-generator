// src/routes/proverbs.js
const express = require('express');
const { getRandomProverb } = require('../controllers/proverbController'); // Ensure correct import
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

// Route to fetch a random transformed proverb with authentication
router.get("/", authenticate, getRandomProverb);

module.exports = router;
