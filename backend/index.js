const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./src/routes/auth");
const proverbRoutes = require("./src/routes/proverbs");

const app = express();

// Middleware

const corsOptions = {
  origin: "proverbscreator.online", // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allow specific HTTP methods
  credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/proverbs", proverbRoutes);

app.get("/health", (req, res) => res.status(200).json({ status: "Working" }));

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
