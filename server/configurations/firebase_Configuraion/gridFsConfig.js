// gridfs.js
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

// Initialize GridFS and return the upload middleware and GridFSBucket
const initGridFS = () => {
  return new Promise((resolve, reject) => {
    // Create a MongoDB connection
    const conn = mongoose.createConnection(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Initialize GridFSBucket
    conn.once('open', () => {
      const bucket = new GridFSBucket(conn.db, {
        bucketName: 'uploads', // Ensure bucket name is consistent
      });
      console.log('GridFSBucket initialized');

      // Configure GridFS storage for multer
      const storage = new GridFsStorage({
        url: mongoURI,
        file: (req, file) => {
          return {
            bucketName: 'uploads', // Ensure bucket name is consistent
            filename: `file_${Date.now()}_${file.originalname}`,
          };
        },
      });

      const upload = multer({ storage });

      // Resolve the promise with upload and bucket
      resolve({ upload, bucket });
    });

    conn.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      reject(err); // Reject the promise on error
    });
  });
};

module.exports = initGridFS;