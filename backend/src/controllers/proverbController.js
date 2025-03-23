const multer = require('multer');
const fs = require('fs');
const path = require('path');
const prisma = require("../../prisma/prismaClient");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.uploadProverbsFile = [
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    if (req.file.mimetype !== "application/json") {
      return res.status(400).json({ error: "Only JSON files are allowed." });
    }

    const filePath = path.join(__dirname, '../../uploads', req.file.filename);

    // Wait for file to be available
    const waitForFile = async (filePath) => {
      let retries = 5;
      while (retries > 0) {
        if (fs.existsSync(filePath)) return true;
        await new Promise(resolve => setTimeout(resolve, 100));
        retries--;
      }
      return false;
    };

    if (!(await waitForFile(filePath))) {
      return res.status(500).json({ error: "File could not be found after upload." });
    }

    try {
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      let data;

      try {
        data = JSON.parse(fileContent);
      } catch (error) {
        return res.status(400).json({ error: "Invalid JSON format." });
      }

      if (!Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid file format. It must be an array of proverbs.' });
      }

      const validProverbs = data.filter(
        (proverb) =>
          typeof proverb.beginning === 'string' &&
          typeof proverb.ending === 'string'
      );

      if (validProverbs.length === 0) {
        return res.status(400).json({ error: 'No valid proverbs found in the file.' });
      }

      const result = await prisma.proverb.createMany({
        data: validProverbs,
        skipDuplicates: true,
      });

      // Delete the file after processing
      try {
        await fs.promises.unlink(filePath);
      } catch (error) {
        console.error("Error deleting file:", error);
      }

      return res.status(200).json({ message: `${result.count} proverbs inserted successfully.` });
    } catch (error) {
      console.error('Error processing file:', error);
      return res.status(500).json({ error: `Error processing the file: ${error.message}` });
    }
  },
];


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

    let firstProverb, secondProverb;
    do {
      firstProverb = await prisma.proverb.findFirst({
        skip: Math.floor(Math.random() * proverbCount),
      });

      secondProverb = await prisma.proverb.findFirst({
        skip: Math.floor(Math.random() * proverbCount),
      });
    } while (firstProverb.id === secondProverb.id);

    const transformedProverb = {
      beginning: firstProverb.beginning,
      ending: secondProverb.ending,
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

exports.updateProverb = async (req, res) => {
  const { id } = req.params;
  const { beginning, ending } = req.body;

  if (typeof beginning !== "string" || typeof ending !== "string") {
    return res.status(400).json({ error: "Beginning and ending must be strings." });
  }

  try {
    const updatedProverb = await prisma.proverb.update({
      where: { id: parseInt(id) },
      data: { beginning, ending },
    });

    return res.status(200).json(updatedProverb);
  } catch (error) {
    console.error("Error updating proverb:", error.message);
    return res.status(500).json({ error: "Error updating proverb" });
  }
};
