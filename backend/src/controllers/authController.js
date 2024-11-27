const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;


const hardcodedCredentials = {
  email: 'user@example.com',
  password: 'password123',
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({ data: { email, password: hashedPassword } });
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: 'User already exists.' });
  }
};

// Login function to authenticate the user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password match the hardcoded credentials
  if (email === hardcodedCredentials.email && password === hardcodedCredentials.password) {
    // Generate a JWT token (with a simple payload)
    const token = jwt.sign({ email }, 'your_jwt_secret', { expiresIn: '1h' });

    // Return the token on successful authentication
    return res.status(200).json({ token });
  } else {
    // Return error if credentials don't match
    return res.status(401).json({ error: 'Invalid email or password' });
  }
};
