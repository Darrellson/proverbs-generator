const fs = require("fs");
const path = require("path");

const proverbsPath = path.join(__dirname, "../data/proverbs.json");

exports.getRandomProverb = async (req, res) => {
  try {
    const proverbsData = fs.readFileSync(proverbsPath, "utf8");
    const proverbs = JSON.parse(proverbsData);

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

    // Combine the transformed beginning and ending
    const combinedProverb = `${selectedProverb.beginning} ${selectedProverb.ending}`;

    res.status(200).json({ combined: combinedProverb });
  } catch (error) {
    console.error("Error reading proverbs file:", error);
    res.status(500).json({ error: "Error fetching proverbs" });
  }
};
