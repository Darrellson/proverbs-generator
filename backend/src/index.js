const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const proverbRoutes = require('./routes/proverbs');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/proverbs', proverbRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(
  cors({
    origin: "proverbs-generator.vercel.app", // Replace with your Vercel domain
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
