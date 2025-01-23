require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/auth');
const proverbRoutes = require('./src/routes/proverbs');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", // Replace with frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'working' }));

// Routes
app.use('/auth', authRoutes);
app.use('/proverbs', proverbRoutes);

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
