const express = require('express');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const prisma = new PrismaClient();

const proverbsPath = path.join(__dirname, './data/proverbs.json');

// Add this log to verify the path
console.log('Proverbs file path:', proverbsPath);

// Add this to your proverbController.js
const testDbConnection = async () => {
  try {
    // Test connection
    const count = await prisma.proverb.count();
    console.log('Number of proverbs in DB:', count);
    
    // Get all proverbs to verify data
    const proverbs = await prisma.proverb.findMany();
    console.log('Proverbs in database:', proverbs);
    
    return { count, proverbs };
  } catch (error) {
    console.error('Database connection error:', error);
    return { error: error.message };
  }
};

// Add this test route
router.get('/test-db', async (req, res) => {
  const result = await testDbConnection();
  res.json(result);
});

// Your existing insertProverbs function
async function insertProverbs() {
  try {
    // Check if proverbs already exist
    const existingCount = await prisma.proverb.count();
    console.log('Existing proverbs count:', existingCount);

    if (existingCount > 0) {
      console.log('Proverbs already exist in database');
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

// Call it when server starts
insertProverbs()
  .catch(console.error);

// Add a route to manually trigger insertion
router.post('/insert', async (req, res) => {
  try {
    await insertProverbs();
    res.json({ message: 'Proverbs insertion completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

