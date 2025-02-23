const Joi = require('joi');

// Email validation middleware
const emailValidation = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { email } = req.body;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  next();
};

// Password validation middleware
const passwordValidation = (req, res, next) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const { password } = req.body;

  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
    });
  }
  next();
};

module.exports = {
  emailValidation,
  passwordValidation,
};
