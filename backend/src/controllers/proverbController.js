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

exports.getRandomProverb = async (req, res) => {
  try {
    const proverbCount = await prisma.proverb.count();
    if (proverbCount < 2) {
      return res.status(404).json({ error: "Not enough proverbs available." });
    }

    // Fetch two random proverbs
    let firstProverb, secondProverb;
    do {
      firstProverb = await prisma.proverb.findFirst({
        skip: Math.floor(Math.random() * proverbCount),
      });

      secondProverb = await prisma.proverb.findFirst({
        skip: Math.floor(Math.random() * proverbCount),
      });
    } while (firstProverb.id === secondProverb.id); // Ensure they're different

    const transformedProverb = {
      beginning: firstProverb.ending, // Swap positions
      ending: secondProverb.beginning,
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
    const proverbs = await prisma.proverb.findMany();
    return res.status(200).json(proverbs);
  } catch (error) {
    console.error("Error fetching proverbs:", error.message);
    return res.status(500).json({ error: "Error fetching proverbs." });
  }
};

exports.createProverb = async (req, res) => {
  const { beginning, ending } = req.body;
  try {
    const newProverb = await prisma.proverb.create({ data: { beginning, ending } });
    return res.status(201).json(newProverb);
  } catch (error) {
    console.error("Error creating proverb:", error.message);
    return res.status(500).json({ error: "Error creating proverb" });
  }
};

exports.deleteProverb = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.proverb.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ message: "Proverb deleted successfully" });
  } catch (error) {
    console.error("Error deleting proverb:", error.message);
    return res.status(500).json({ error: "Error deleting proverb" });
  }
};