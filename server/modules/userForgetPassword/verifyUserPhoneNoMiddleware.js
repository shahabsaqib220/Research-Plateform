// middleware/verifyPhoneNumber.js
const verifyPhoneNumber = (req, res, next) => {
    const { phoneNumber } = req.body; // User input phone number without the '+' sign
    const { userPhoneNumber } = req;
  
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }
  
    // Format the expected phone number with the country code
    const expectedPhoneNumber = `92${userPhoneNumber.slice(2)}`; // Assuming the phone number starts with '92'
  
    // Verify the phone number
    if (phoneNumber !== expectedPhoneNumber) {
      return res.status(400).json({ error: 'Phone number does not match.' });
    }
  
    // If the phone number matches, proceed to the next middleware or route handler
    next();
  };
  
  module.exports = verifyPhoneNumber;