const express = require('express');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const prisma = new PrismaClient();

const proverbsPath = path.resolve(__dirname, '../../data/proverbs.json');

// Insert proverbs function (optional)
async function insertProverbs() {
  try {
    const proverbsData = fs.readFileSync(proverbsPath, 'utf8');
    const proverbs = JSON.parse(proverbsData);

    if (proverbs && proverbs.length > 0) {
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

// Get random proverb function
const getRandomProverb = async (req, res) => {
  try {
    const proverbs = await prisma.proverb.findMany();

    if (!proverbs || proverbs.length === 0) {
      return res.status(404).json({ error: "No proverbs found." });
    }

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
};

module.exports = {
  router,
  getRandomProverb,
};
// Define the route and export the router
router.get('/random', getRandomProverb);

