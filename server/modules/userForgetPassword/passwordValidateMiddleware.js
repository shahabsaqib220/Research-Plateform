// middleware/validatePassword.js
const validatePassword = (req, res, next) => {
    const { password, confirmPassword } = req.body;
  
    // Password validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: 'Passwords do not match.',
      });
    }
  
    // Check if password meets the criteria
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }
  
    next();
  };
  
  module.exports = validatePassword;