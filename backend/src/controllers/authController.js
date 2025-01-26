const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../prisma/prismaClient");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Additional validation
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Ensure strong password
    if (password.length < 8) {
      return res.status(400).json({ error: "Password too short" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { 
        email: email.toLowerCase(), // Normalize email
        password: hashedPassword 
      }
    });

    console.log("User registered:", newUser.email);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() } 
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Log details for debugging
    console.log('Stored Hashed Password:', user.password);
    console.log('Attempted Password:', password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.logout = (req, res) => {
  return res.clearCookie("authToken").status(200).json({ message: "Logged out successfully." });
};
