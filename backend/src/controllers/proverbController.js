const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.generateProverb = async (req, res) => {
  const proverbs = await prisma.proverb.findMany();
  if (proverbs.length < 2) return res.status(500).json({ error: 'Not enough proverbs' });

  // Select two random proverbs
  const [p1, p2] = proverbs.sort(() => 0.5 - Math.random()).slice(0, 2);

  // Generate a new proverb
  const firstPart = p2.text.split(',')[0];
  const secondPart = p1.text.split(',').slice(1).join(',');
  const combined = `${firstPart}, ${secondPart}`;

  res.json({ combined });
};
