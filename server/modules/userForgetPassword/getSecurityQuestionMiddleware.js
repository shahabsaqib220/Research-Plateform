// middleware/getSecurityQuestions.js
const User = require('../userRegistration/userRegistrationModel');

const getSecurityQuestions = async (req, res, next) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log(email)

    if (!user) {
      return res.status(404).json({ error: 'User  not found.' });
    }

    // Attach security questions to the request object
    req.securityQuestions = user.securityQuestions;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error fetching security questions:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = getSecurityQuestions;