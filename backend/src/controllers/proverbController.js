const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getProverbs = async (req, res) => {
  const proverbs = await prisma.proverb.findMany();
  if (proverbs.length < 2) return res.status(500).json({ error: 'Not enough proverbs' });

  const [p1, p2] = proverbs.sort(() => 0.5 - Math.random()).slice(0, 2);
  const splitPoint = p1.text.indexOf(',');
  const combined = `${p1.text.substring(0, splitPoint)} ${p2.text}`;
  res.json({ combined });
};

exports.seedProverbs = async (req, res) => {
  const proverbs = require('../data/proverbs');
  try {
    await prisma.proverb.createMany({ data: proverbs.map((text) => ({ text })) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error seeding proverbs' });
  }
};
