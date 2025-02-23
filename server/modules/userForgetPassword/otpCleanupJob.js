const cron = require('node-cron');
const UserResetPasswordOtp = require('./userForgetPasswordmodel'); // Adjust the path as necessary

// Schedule a job to run every minute
cron.schedule('* * * * *', async () => {
    try {
        const result = await UserResetPasswordOtp.deleteMany({ expiresAt: { $lt: new Date() } });
        console.log(`Expired OTPs cleared: ${result.deletedCount}`);
    } catch (error) {
        console.error('Error clearing expired OTPs:', error);
    }
});