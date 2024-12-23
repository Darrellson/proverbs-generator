const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load proverbs from JSON file
const proverbsPath = path.join(__dirname, '../data/proverbs.json');

router.get('/', (req, res) => {
  fs.readFile(proverbsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading proverbs.json:', err);
      return res.status(500).json({ error: 'Failed to load proverbs' });
    }

    const proverbs = JSON.parse(data);
    if (proverbs.length < 2) {
      return res.status(500).json({ error: 'Not enough proverbs' });
    }

    const firstProverb = proverbs[Math.floor(Math.random() * proverbs.length)];
    const secondProverb = proverbs[Math.floor(Math.random() * proverbs.length)];

    const firstPart = firstProverb.split(',')[0];
    const secondPart = secondProverb.split(',').slice(1).join(',');

    const combined = `${firstPart},${secondPart}`;
    res.json({ combined });
  });
});

module.exports = router;
