const prisma = require("../../prisma/prismaClient");

exports.insertProverbs = async (req, res) => {
  const { proverbs } = req.body;

  if (!Array.isArray(proverbs) || proverbs.length === 0) {
    return res.status(400).json({ error: "Provide an array of proverbs." });
  }

  const validProverbs = proverbs.filter(
    (proverb) =>
      typeof proverb.beginning === "string" &&
      typeof proverb.ending === "string"
  );

  if (validProverbs.length === 0) {
    return res.status(400).json({ error: "No valid proverbs provided." });
  }

  try {
    const result = await prisma.proverb.createMany({
      data: validProverbs,
      skipDuplicates: true,
    });

    return res
      .status(200)
      .json({ message: `${result.count} proverbs inserted successfully.` });
  } catch (error) {
    console.error("Error inserting proverbs:", error.message);
    return res.status(500).json({ error: "Error inserting proverbs." });
  }
};

exports.deleteProverb = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.proverb.delete({
      where: { id: parseInt(id) },
    });
    return res.status(200).json({ message: "Proverb deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error deleting proverb" });
  }
};

exports.createProverb = async (req, res) => {
  const { beginning, ending } = req.body;
  try {
    const newProverb = await prisma.proverb.create({
      data: { beginning, ending },
    });
    return res.status(201).json(newProverb);
  } catch (error) {
    return res.status(500).json({ error: "Error creating proverb" });
  }
};

exports.getRandomProverb = async (req, res) => {
  try {
    const proverbCount = await prisma.proverb.count();
    if (proverbCount === 0) {
      return res.status(404).json({ error: "No proverbs found." });
    }

    const randomProverb = await prisma.proverb.findFirst({
      skip: Math.floor(Math.random() * proverbCount),
    });

    const transformedProverb = {
      beginning: randomProverb.ending,
      ending: randomProverb.beginning,
    };

    return res.status(200).json({
      combined: `${transformedProverb.beginning} ${transformedProverb.ending}`,
    });
  } catch (error) {
    console.error("Error fetching proverb:", error.message);
    return res.status(500).json({ error: "Error fetching proverb." });
  }
};

exports.getProverbs = async (req, res) => {
  try {
    const proverbs = await prisma.proverb.findMany({ orderBy: { id: "asc" } });
    return proverbs.length
      ? res.status(200).json(proverbs)
      : res.status(404).json({ message: "No proverbs found." });
  } catch (error) {
    console.error("Error fetching proverbs:", error.message);
    return res.status(500).json({ error: "Error fetching proverbs." });
  }
};
