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

    const randomIndex = Math.floor(Math.random() * proverbs.length);
    res.status(200).json({ combined: proverbs[randomIndex] });
  } catch (error) {
    console.error("Error reading proverbs file:", error);
    res.status(500).json({ error: "Error fetching proverbs" });
  }
};
