const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Invalid token format, authorization denied' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    // Ensure `decoded` contains `userId`
    if (decoded && decoded.user && decoded.user.userId) {
      req.user = { userId: decoded.user.userId, email: decoded.user.email }; // Assign userId to req.user
      // console.log('User Info from Token:', req.user);
      next(); // Proceed to the next middleware/route handler
    } else {
      console.error('User data not found in token');
      // return res.status(401).json({ error: 'User data not found in token' });
    }
  } catch (err) {
    // Handle JWT errors
    // console.error('JWT Verification Error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please login again' });
    } else {
      return res.status(401).json({ error: 'Token is not valid, authorization denied' });
    }
  }
};

module.exports = authMiddleware;
