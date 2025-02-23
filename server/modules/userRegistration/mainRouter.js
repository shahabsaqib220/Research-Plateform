const express = require('express');
const { generateOtp, verifyOtp, registerUser } = require('./router');
const validateUser = require('../userRegistration/middleware');
const router = express.Router();
const upload = require('../../utils/multerConfig');

// Multer configuration for file uploads

// POST: Send OTP
router.post('/send-otp', generateOtp);

// POST: Verify OTP
router.post('/verify-otp', verifyOtp);

// POST: Register User
router.post('/register', upload.array('file', 3), registerUser);



module.exports = router;
