const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../prisma/prismaClient");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = "1d";  
const REFRESH_TOKEN_EXPIRATION = "7d";  

// Register User
exports.register = async (req, res) => {
  const { email, password, isAdmin = false } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ error: "User already exists" });

    if (password.length < 8) return res.status(400).json({ error: "Password too short" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email: email.toLowerCase(), password: hashedPassword, isAdmin }
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Registration failed" });
  }
};

// Login User & Issue Tokens
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Store refreshToken in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    return res.status(200).json({ token, refreshToken, isAdmin: user.isAdmin });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};



// Logout User & Invalidate Refresh Token
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  // Invalidate the refresh token in the database (optional)
  if (refreshToken) {
    await prisma.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: null }
    });
  }

  res.clearCookie("authToken").status(200).json({ message: "Logged out successfully" });
};

// Refresh Access Token using Refresh Token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, isAdmin: decoded.isAdmin },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.json({ token: newAccessToken });
  } catch (error) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
};
