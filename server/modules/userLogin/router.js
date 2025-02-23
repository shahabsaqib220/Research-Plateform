const express = require('express');
const User = require('../userRegistration/userRegistrationModel'); 
const connectDB = require('../../db');
const router = express.Router();

connectDB();

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // If want to exclude something from the response for example the security questions and answers then execute the follwong line that are given below

    // const user = await User.findOne({ email }).select('-securityQuestions -securityAnswers');


    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a token
    const token = user.generateAuthToken();
    // Genersting JWT 

    // Send success  to the frotnend
    res.status(200).json({
      message: 'Login successful',
      token,
      user,
    
    });
  } catch (error) {
    next(error); // Pass errors to error-handling middleware
  }
};

module.exports = userLogin;



