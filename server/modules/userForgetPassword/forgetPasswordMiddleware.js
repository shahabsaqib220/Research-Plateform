const UserResetPasswordOtp = require('./userForgetPasswordmodel'); // Adjust path as necessary

// Middleware to log expired OTPs (optional)
const clearExpiredOtps = async (req, res, next) => {
    try {
        // This middleware can be used for logging or other purposes
        console.log('Checking for expired OTPs...');
        next();
    } catch (error) {
        console.error('Error in clearExpiredOtps middleware:', error);
        next();
    }
};

module.exports = clearExpiredOtps;