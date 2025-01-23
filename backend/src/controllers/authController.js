const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../prisma/prismaClient");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error.message);
    return res.status(400).json({ error: "User already exists or invalid data." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.logout = (req, res) => {
  return res.clearCookie("authToken").status(200).json({ message: "Logged out successfully." });
};
