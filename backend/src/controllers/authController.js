const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "All fields required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({ data: { email, password: hashedPassword } });
    res.status(201).json({ message: "User registered successfully" });
  } catch {
    res.status(400).json({ error: "User already exists or invalid data" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

exports.logout = (req, res) => res.clearCookie("authToken").status(200).json({ message: "Logged out" });
