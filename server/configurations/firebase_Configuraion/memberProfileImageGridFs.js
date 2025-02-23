const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

let gfsBucket, upload;

// Function to initialize GridFSBucket and upload middleware
const initGroupMemberGridFS = async () => {
  const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return new Promise((resolve, reject) => {
    conn.once('open', () => {
      console.log('MongoDB connection established for GridFS');

      gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'groupMemberProfileImages',
      });

      const storage = new GridFsStorage({
        url: mongoURI,
        file: (req, file) => ({
          bucketName: 'groupMemberProfileImages',
          filename: `groupMember_${Date.now()}_${file.originalname}`,
        }),
      });

      upload = multer({ storage });
      console.log('Upload middleware initialized');

      // Explicitly resolve with the required properties
      resolve({ upload, gfs: gfsBucket });
    });

    conn.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      reject(err);
    });
  });
};


const getGridFSBucket = () => gfsBucket;
const getUploadMiddleware = () => upload;

module.exports = {
  initGroupMemberGridFS,
  getGridFSBucket,
  getUploadMiddleware,
};
