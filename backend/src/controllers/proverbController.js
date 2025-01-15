const express = require('express');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const prisma = new PrismaClient();

// Adjust the path as needed (absolute path for more reliability)
const proverbsPath = path.resolve(__dirname, '../../data/proverbs.json'); // Adjust path based on where the file is located

// Insert proverbs into the database (run this once)
async function insertProverbs() {
  try {
    const proverbsData = fs.readFileSync(proverbsPath, 'utf8');
    const proverbs = JSON.parse(proverbsData);

    if (proverbs && proverbs.length > 0) {
      // Insert each proverb into the database
      for (const proverb of proverbs) {
        await prisma.proverb.create({
          data: {
            beginning: proverb.beginning,
            ending: proverb.ending,
          },
        });
      }
      console.log('Proverbs inserted successfully!');
    } else {
      console.log('No proverbs to insert.');
    }
  } catch (error) {
    console.error('Error inserting proverbs:', error);
  }
}

async function getRandomProverb(req, res) {
  try {
    const proverbs = await prisma.proverb.findMany();

    if (!proverbs || proverbs.length === 0) {
      return res.status(404).json({ error: "No proverbs found." });
    }

    // Transform proverbs by swapping beginning and ending
    const transformedProverbs = proverbs.map((proverb) => ({
      beginning: proverb.ending,
      ending: proverb.beginning,
    }));

    const randomIndex = Math.floor(Math.random() * transformedProverbs.length);
    const selectedProverb = transformedProverbs[randomIndex];

    const combinedProverb = `${selectedProverb.beginning} ${selectedProverb.ending}`;

    res.status(200).json({ combined: combinedProverb });
  } catch (error) {
    console.error("Error fetching proverbs:", error);
    res.status(500).json({ error: "Error fetching proverbs" });
  }
}

module.exports = {
  getRandomProverb,
};

// Route to insert proverbs into the database
router.post('/insert', async (req, res) => {
  await insertProverbs();
  res.status(200).json({ message: 'Proverbs inserted successfully' });
});

// Route to fetch a random transformed proverb
router.get('/random', getRandomProverb);

// // Export router correctly
// module.exports = router;
