const mongoose = require('mongoose');
const User = require('../userRegistration/userRegistrationModel'); // User model
const nodemailer = require('nodemailer');
const UserResetPasswordOtp = require('./userForgetPasswordmodel'); // Adjust the path as necessary
const clearExpiredOtps = require('./forgetPasswordMiddleware');
const bcrypt = require('bcrypt');
require('dotenv').config()


const getUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User   not found' });
    }

    // Check if the user has a profile image
    if (user.profileImageId) {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads',
      });

      const fileId = new mongoose.Types.ObjectId(user.profileImageId);

      // Stream the image from GridFS
      const downloadStream = bucket.openDownloadStream(fileId);
      let imageBuffer = Buffer.alloc(0);

      downloadStream.on('data', (chunk) => {
        imageBuffer = Buffer.concat([imageBuffer, chunk]);
      });

      downloadStream.on('error', (err) => {
        console.error('Error retrieving image:', err);
        return res.status(500).json({ error: 'Error retrieving image' });
      });

      downloadStream.on('end', () => {
        const profileImage = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
        return res.status(200).json({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          profileImage, // Return profile image only if it exists
        });
      });
    } else {
      // Return user data without profileImage if no profile image is found
      return res.status(200).json({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
      });
    }
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Generate a random 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  // Validate email format
  if (!email || !/.+@.+\..+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); 

  try {
     
      let otpEntry = await UserResetPasswordOtp.findOne({ email });

      if (otpEntry) {
         
          otpEntry.otp = otp;
          otpEntry.expiresAt = expiresAt;
          await otpEntry.save();
      } else {
          
          otpEntry = new UserResetPasswordOtp({ email, otp, expiresAt });
          await otpEntry.save();
      }

      console.log(`OTP for ${email} is ${otp}, valid until ${expiresAt}`);
      res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ error: 'Failed to send OTP' });
  }
};

const verifyReseOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    await UserResetPasswordOtp.deleteOne({ email, otp });

    return res.status(200).json({ message: 'OTP verified successfully!' });
  } catch (error) {
    console.error('Error in OTP verification route:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const getUserSecurityQuestions = (req, res) => {
  return res.status(200).json({ securityQuestions: req.securityQuestions });

}

const verifySecurityAnswers = async (req, res) => {
  return res.status(200).json({ message: 'All answers verified successfully!' })

}

const verifyPhoneNumber = (req, res) => {
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

  // If the phone number matches, respond with success
  return res.status(200).json({ message: 'Phone number verified successfully!' });
};

const UserResetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update the password field
    user.password = password;

    // Save the user document (the pre-save hook will handle hashing)
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while resetting the password.' });
  }
};






module.exports = { getUserByEmail, sendResetOtp, verifyReseOtp, getUserSecurityQuestions, verifySecurityAnswers, verifyPhoneNumber, UserResetPassword };