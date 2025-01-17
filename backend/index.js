const express = require("express");
const router = express.Router(); 
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./src/routes/auth");
const proverbRoutes = require("./src/routes/proverbs"); // Ensure correct import here

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from this origin
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allow specific HTTP methods
  credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use('/proverbs', proverbRoutes);  

app.get("/health", (req, res) => res.status(200).json({ status: "Working" }));

// Add this to your backend route
router.get('/test', async (req, res) => {
  try {
    const count = await prisma.proverb.count();
    res.json({ count });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
