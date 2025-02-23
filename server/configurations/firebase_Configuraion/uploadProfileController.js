const User = require('../../modules/userRegistration/userRegistrationModel');
const { v2: cloudinary } = require('cloudinary');
const mongoose = require('mongoose');
const multer = require('multer');
const { broadcastMessage } = require('../../websocketServer');
require('dotenv').config();
const initGridFS = require('../../configurations/firebase_Configuraion/gridFsConfig');
 // Path to your GridFS config

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Set in .env file
  api_key: process.env.CLOUDINARY_API_KEY, // Set in .env file
  api_secret: process.env.CLOUDINARY_API_SECRET, // Set in .env file
});


const uploadCoverImage = async (req, res) => {
  try {
    // Initialize GridFS and get the upload middleware and bucket
    const { upload, bucket } = await initGridFS();

    // Handle file upload using multer
    upload.single('coverImage')(req, res, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        return res.status(500).json({ message: 'File upload failed', error: err });
      }

      // Check if file exists
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Extract userId from request parameters
      const { userId } = req.params;

      // Find user in database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If the user already has a cover image, delete the old file from GridFS
      if (user.coverImageUrl) {
        const oldFileId = user.coverImageUrl.split('/').pop(); // Extract the file ID from the URL
        const _id = new mongoose.Types.ObjectId(oldFileId); // Convert to ObjectId

        // Delete the old file from GridFS using GridFSBucket
        bucket.delete(_id, (err) => {
          if (err) {
            console.error('Error deleting old file:', err);
          } else {
            console.log('Old file deleted successfully');
          }
        });
      }

      // Construct file URL from GridFS
      const fileId = req.file.id.toString();
      const fileUrl = `/uploads/${fileId}`;

      // Update user's cover image URL in database
      user.coverImageUrl = fileUrl;
      await user.save();

      res.status(200).json({
        message: 'Cover image uploaded successfully',
        coverImageUrl: user.coverImageUrl,
      });
    });
  } catch (error) {
    console.error('Error uploading cover image:', error);
    res.status(500).json({ message: 'Failed to upload cover image' });
  }
};


// Profile image upload function
const uploadProfileImage = async (req, res) => {
  try {
    // Initialize GridFS
    const { upload, bucket } = await initGridFS();

    // Use Multer middleware to handle file upload
    upload.single('profileImage')(req, res, async (err) => {
      if (err) {
        console.error('Upload Error:', err.message);
        return res.status(400).json({ error: 'File upload failed' });
      }

      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Check if user is authenticated
      if (!req.user || !req.user.userId) {
        console.error('User authentication data missing');
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Find the user in the database
      const user = await User.findById(req.user.userId);
      if (!user) {
        console.error('User not found');
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete previous profile image from GridFS if it exists
      if (user.profileImageUrl) {
        try {
          const fileId = new mongoose.Types.ObjectId(user.profileImageUrl);
          await bucket.delete(fileId);
          console.log('Previous profile image deleted from GridFS');
        } catch (deleteErr) {
          console.error('Failed to delete previous profile image:', deleteErr);
        }
      }

      // Store the new profile image file ID in GridFS
      const newProfileImageId = req.file.id;

      // Update the user's profile with the new image URL (GridFS file ID)
      user.profileImageUrl = newProfileImageId.toString();
      const updatedUser = await user.save();

      // Respond with the updated user data
      res.status(200).json({
        message: 'Profile image uploaded successfully',
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          profileImageUrl: updatedUser.profileImageUrl,
        },
      });
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred while uploading the profile image' });
  }
};

const getCoverImage = async (req, res) => {
  try {
    // Initialize GridFS and get the bucket
    const { bucket } = await initGridFS();

    if (!bucket) {
      throw new Error('GridFSBucket is not initialized');
    }

    // Extract file ID from request parameters
    const { fileId } = req.params;

    // Convert fileId to ObjectId
    const _id = new mongoose.Types.ObjectId(fileId);

    // Find the file in GridFS
    const files = await bucket.find({ _id }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Stream the file to the client
    const downloadStream = bucket.openDownloadStream(_id);
    downloadStream.on('error', (err) => {
      console.error('Error streaming file:', err);
      res.status(500).json({ message: 'Error streaming file' });
    });

    // Set the content type based on the file's metadata
    res.set('Content-Type', files[0].contentType);
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error retrieving cover image:', error);
    res.status(500).json({ message: 'Failed to retrieve cover image' });
  }
};














module.exports = { uploadProfileImage,uploadCoverImage, getCoverImage };
