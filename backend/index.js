const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const proverbRoutes = require('./src/routes/proverbs');

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://proverbs-generator.vercel.app/", // Replace with your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow sending cookies
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/proverbs', proverbRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Working' });
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
