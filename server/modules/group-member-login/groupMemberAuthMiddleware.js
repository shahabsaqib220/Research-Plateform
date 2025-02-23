// groupMemberAuthMiddleware.js
const jwt = require('jsonwebtoken');

const groupmemberAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  console.log('Token by the group member:', token); // Log the token

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Remove the "Bearer " prefix from the token
  const tokenWithoutPrefix = token.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(tokenWithoutPrefix, process.env.GROUP_MEMBER_JWT_SECRET);
    req.user = decoded;
    console.log('Decoded token by the group member:', decoded); // Log the decoded token
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token 1.' });
  }
};

module.exports = { groupmemberAuthMiddleware }; // Ensure proper export