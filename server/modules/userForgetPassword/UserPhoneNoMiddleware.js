// middleware/getUser PhoneNumber.js
const User = require('../userRegistration/userRegistrationModel');

const getUserPhoneNumber = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User  not found.' });
    }

    // Attach the user's phone number to the request object
    req.userPhoneNumber = user.phone; // Assuming the phone number is stored without the country code

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error fetching user phone number:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = getUserPhoneNumber;