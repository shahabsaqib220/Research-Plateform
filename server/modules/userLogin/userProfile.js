const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../userRegistration/userRegistrationModel'); 
const connectDB = require('../../db');
const initGridFS = require('../../configurations/firebase_Configuraion/gridFsConfig');



connectDB();


const userProfileImage = async (req, res) => {
  try {
    const { bucket } = await initGridFS();
    const fileId = req.params.id;

    // Convert fileId to ObjectId
    const objectId = new mongoose.Types.ObjectId(fileId);

    // Check if the file exists in GridFS
    const files = await bucket.find({ _id: objectId }).toArray();
    if (!files.length) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Set the content type header
    res.set('Content-Type', files[0].contentType);

    // Stream the file to the response
    const downloadStream = bucket.openDownloadStream(objectId);
    downloadStream.pipe(res);
    
  } catch (error) {
    console.error('Error retrieving profile image:', error.message);
    res.status(500).json({ error: 'An error occurred while retrieving the profile image' });
  }
}





const getUserInfo = async (req, res) => {
  try {
    // Get userId from `req.user` set by the authMiddleware
    const { userId } = req.user;

    // Fetch user information from the database
    const user = await User.findById(userId).select('-password'); // Exclude sensitive fields like password

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user information to the frontend
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user info:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};



module.exports = { getUserInfo,userProfileImage};