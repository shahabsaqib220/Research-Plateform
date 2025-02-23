// middleware/verifySecurityAnswers.js
const bcrypt = require('bcrypt');
const User = require('../userRegistration/userRegistrationModel');

const verifySecurityAnswers = async (req, res, next) => {
  const { email, answers } = req.body;

  if (!email || !answers || answers.length !== 3) {
    return res.status(400).json({ error: 'Email and three answers are required.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Verify each answer
    for (let i = 0; i < user.securityAnswers.length; i++) {
      const isMatch = await bcrypt.compare(answers[i], user.securityAnswers[i]);
      if (!isMatch) {
        return res.status(400).json({ error: `Invalid Answers!` });
      }
    }

    // If all answers are correct, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying security answers:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = verifySecurityAnswers;