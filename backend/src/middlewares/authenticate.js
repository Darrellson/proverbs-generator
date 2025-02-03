const jwt = require("jsonwebtoken");
const prisma = require("@prisma/client");  // Assuming you have Prisma set up
const JWT_SECRET = process.env.JWT_SECRET;

// Token Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = user; 
    next();
  });
};

// Admin Authorization Middleware
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Fetch user from the database using Prisma based on userId
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { authenticateToken, isAdmin };
