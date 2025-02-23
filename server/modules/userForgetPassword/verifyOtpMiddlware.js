// middleware/verifyOtp.js
const UserResetPasswordOtp = require('./userForgetPasswordmodel');

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required.' });
  }

  try {

    const otpRecord = await UserResetPasswordOtp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or Expired OTP.' });
    }
    next();
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = verifyOtp;