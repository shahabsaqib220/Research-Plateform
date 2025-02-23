const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
});

// Method to compare passwords
loginSchema.methods.comparePassword = async function (enteredPassword, hashedPassword) {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Method to generate a token
loginSchema.methods.generateToken = function (userId, email) {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: '24h', // Token valid for 1 hour
  });
};

const Login = mongoose.model('Login', loginSchema);

module.exports = Login;
