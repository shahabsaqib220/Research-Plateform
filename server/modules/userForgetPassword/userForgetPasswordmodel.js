const mongoose = require('mongoose');

const userResetPasswordOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const UserResetPasswordOtp = mongoose.model('UserResetPasswordOtp', userResetPasswordOtpSchema);

module.exports = UserResetPasswordOtp;