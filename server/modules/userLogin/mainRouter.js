const express = require('express');
const router = express.Router();
const { uploadProfileImage, uploadCoverImage, getCoverImage } = require('../../configurations/firebase_Configuraion/uploadProfileController');
const authMiddleware = require('../Authentication_middleware/authMiddleware');
const {userProfileImage, getUserInfo} = require('./userProfile')

const initGridFS = require('../../configurations/firebase_Configuraion/gridFsConfig');
const loginRouter = require('./router'); // Adjust path


router.post('/auth', loginRouter);
router.post('/uploadProfileImage', authMiddleware, uploadProfileImage);

router.put('/users/:userId/cover-image', authMiddleware, async (req, res, next) => {
  try {
    // Call the controller to handle the file upload
    await uploadCoverImage(req, res, next);
  } catch (error) {
    console.error('Error during file upload process:', error);
    res.status(500).json({ message: 'Error processing upload request' });
  }
});



router.get('/uploads/:fileId',authMiddleware,getCoverImage);
router.get('/profileImage/:id',authMiddleware,  userProfileImage);
router.get('/userinfo', authMiddleware, getUserInfo);

module.exports = router;
