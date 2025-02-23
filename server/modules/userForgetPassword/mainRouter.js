const express = require('express');
const { getUserByEmail, sendResetOtp, verifyReseOtp, getUserSecurityQuestions, verifySecurityAnswers, verifyPhoneNumber, UserResetPassword } = require('../userForgetPassword/router');
const clearExpiredOtps = require('./forgetPasswordMiddleware');
const verifyOtp = require("./verifyOtpMiddlware")
const getSecurityQuestions = require("./getSecurityQuestionMiddleware")
const verifyUserSecurityAnswers = require('./verifySecurityQuesstionMiddlware')
const getUserPhoneNoMiddleware = require("./UserPhoneNoMiddleware");
const passwordValidateMiddleware = require("./passwordValidateMiddleware")





// If we want to remove the otp from database after the 2 minutes then execute the below line
// require('./otpCleanupJob')



const router = express.Router();

router.post('/forgot-password', getUserByEmail);
router.post('/send-reset-otp',clearExpiredOtps, sendResetOtp);
router.post('/verify-reset-otp', verifyOtp, verifyReseOtp);
router.get('/get-security-questions', getSecurityQuestions, getUserSecurityQuestions);
router.post('/verify-security-questions', verifyUserSecurityAnswers, verifySecurityAnswers);
router.post('/verify-phone-number', getUserPhoneNoMiddleware, verifyPhoneNumber );
router.post('/user-new-password',passwordValidateMiddleware , UserResetPassword  );

module.exports = router;
