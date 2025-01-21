const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to insert proverbs into the database from request body
async function insertProverbs(req, res) {
  try {
    const { proverbs } = req.body;

    if (!Array.isArray(proverbs) || proverbs.length === 0) {
      return res.status(400).json({ error: 'Invalid proverbs format. Provide an array of proverbs.' });
    }

    // Validate each proverb object
    const validProverbs = proverbs.filter(
      (proverb) => typeof proverb.beginning === 'string' && typeof proverb.ending === 'string'
    );

    if (validProverbs.length === 0) {
      return res.status(400).json({ error: 'No valid proverbs provided.' });
    }

    // Insert proverbs into the database
    const result = await prisma.proverb.createMany({
      data: validProverbs,
      skipDuplicates: true, // Avoid inserting duplicate records
    });

    res.status(200).json({ message: `${result.count} proverbs inserted successfully.` });
  } catch (error) {
    console.error('Error inserting proverbs:', error.message);
    res.status(500).json({ error: 'Error inserting proverbs.' });
  }
}

// Function to fetch a random transformed proverb
const getRandomProverb = async (req, res) => {
  try {
    const proverbCount = await prisma.proverb.count();

    if (proverbCount === 0) {
      return res.status(404).json({ error: 'No proverbs found.' });
    }

    // Fetch a random proverb
    const randomProverb = await prisma.proverb.findFirst({
      skip: Math.floor(Math.random() * proverbCount),
    });

    const transformedProverb = {
      beginning: randomProverb.ending,
      ending: randomProverb.beginning,
    };

    const combinedProverb = `${transformedProverb.beginning} ${transformedProverb.ending}`;
    res.status(200).json({ combined: combinedProverb });
  } catch (error) {
    console.error('Error fetching proverb:', error.message);
    res.status(500).json({ error: 'Error fetching proverb.' });
  }
};

// Function to fetch all proverbs
const getProverbs = async (req, res) => {
  try {
    const proverbs = await prisma.proverb.findMany({
      orderBy: { id: 'asc' }, // Fetch in ascending order by ID
    });

    if (proverbs.length === 0) {
      return res.status(404).json({ message: 'No proverbs found.' });
    }

    res.status(200).json(proverbs);
  } catch (error) {
    console.error('Error fetching proverbs:', error.message);
    res.status(500).json({ error: 'Error fetching proverbs.' });
  }
};

module.exports = {
  insertProverbs,
  getRandomProverb,
  getProverbs,
};
