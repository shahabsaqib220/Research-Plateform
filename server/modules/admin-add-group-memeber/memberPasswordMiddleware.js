const memberPasswordValidation = (req, res, next) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const { password } = req.body;

  // Only validate if the password is provided
  if (password) {
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
      });
    }
  }

  // If password is not provided or is valid, move to the next middleware or controller
  next();
};

module.exports = memberPasswordValidation;
