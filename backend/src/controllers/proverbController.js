const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const proverbsPath = path.join(__dirname, '../data/proverbs.json');

// Function to insert proverbs into the database
async function insertProverbs() {
  try {
    const existingCount = await prisma.proverb.count();
    console.log('Existing proverbs count:', existingCount);

    if (existingCount > 0) {
      console.log('Proverbs already exist in the database');
      return;
    }

    const proverbsData = fs.readFileSync(proverbsPath, 'utf8');
    const proverbs = JSON.parse(proverbsData);

    if (proverbs && proverbs.length > 0) {
      const result = await prisma.proverb.createMany({
        data: proverbs.map(proverb => ({
          beginning: proverb.beginning,
          ending: proverb.ending,
        })),
      });
      console.log(`Successfully inserted ${result.count} proverbs!`);
    } else {
      console.log('No proverbs to insert.');
    }
  } catch (error) {
    console.error('Error inserting proverbs:', error);
    throw error;
  }
}

// Function to get a random transformed proverb
const getRandomProverb = async (req, res) => {
  try {
    const proverbCount = await prisma.proverb.count();
    if (proverbCount === 0) {
      return res.status(404).json({ error: "No proverbs found." });
    }

    const randomIndex = Math.floor(Math.random() * proverbCount);
    const selectedProverb = await prisma.proverb.findMany({
      skip: randomIndex,
      take: 1,
    });

    const transformedProverb = {
      beginning: selectedProverb[0].ending,
      ending: selectedProverb[0].beginning,
    };

    const combinedProverb = `${transformedProverb.beginning} ${transformedProverb.ending}`;
    res.status(200).json({ combined: combinedProverb });
  } catch (error) {
    console.error('Error fetching proverbs:', error);
    res.status(500).json({ error: 'Error fetching proverbs' });
  }
};

module.exports = {
  insertProverbs,
  getRandomProverb,
};
