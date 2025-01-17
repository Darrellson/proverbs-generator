const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware setup
const corsOptions = {
  origin: "http://localhost:5173", // Your frontend URL
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require("./src/routes/auth");
const proverbRoutes = require("./src/routes/proverbs");

app.use("/auth", authRoutes);
app.use("/proverbs", proverbRoutes);

app.get("/health", (req, res) => res.status(200).json({ status: "Working" }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
