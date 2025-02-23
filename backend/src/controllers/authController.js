const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../prisma/prismaClient");

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const JWT_EXPIRATION = "15m";
const REFRESH_TOKEN_EXPIRATION = "7d";

// Generate access token
const generateAccessToken = (user) =>
  jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

// Generate refresh token
const generateRefreshToken = (user) =>
  jwt.sign({ userId: user.id }, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });

// Register a new user
exports.register = async (req, res) => {
  const { email, password, isAdmin = false } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ error: "User already exists" });

    if (password.length < 8) return res.status(400).json({ error: "Password too short" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email: email.toLowerCase(), password: hashedPassword, isAdmin },
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Registration failed" });
  }
};

// Login user and generate tokens
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production for secure cookies
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ accessToken, isAdmin: user.isAdmin });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

// Logout user
exports.logout = async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
};

// Refresh access token using the refresh token
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid refresh token" });

    const accessToken = generateAccessToken({ id: decoded.userId });
    return res.json({ accessToken });
  });
};

// Check if user is admin
exports.isAdmin = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { isAdmin: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
