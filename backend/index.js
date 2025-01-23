const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Only apply express.json() to POST, PUT, PATCH, and DELETE routes
app.use(cors({
  origin: process.env.CLIENT_ORIGIN, // Default fallback
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}));

// Parse JSON only for POST, PUT, PATCH, DELETE
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

app.use(cookieParser());

// Simple health check route
app.get("/health", (req, res) => {
  return res.status(200).json({ status: "Working" });
});


// Routes
const authRoutes = require("./src/routes/auth");
const proverbRoutes = require("./src/routes/proverbs");

app.use("/auth", authRoutes);
app.use("/proverbs", proverbRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
