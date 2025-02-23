const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';  // Use a strong secret key

// Function to sign (generate) JWT
const signToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }  // Token expires in 1 hour
  );
};

// Function to verify JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error('JWT Verification Error:', err);  // Log the error
    return null;  // If token is invalid or expired
  }
};

module.exports = { signToken, verifyToken };
