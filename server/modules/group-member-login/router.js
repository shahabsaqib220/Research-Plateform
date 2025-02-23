const express = require('express');
const router = express.Router();
const {groupmemberAuthMiddleware} = require('./groupMemberAuthMiddleware');
const { emailValidation, passwordValidation } = require('../../modules/group-member-login/validationMiddleware');
const { login, groupMemberuploadProfileImage,delete_group_member_education, get_group_member_education, groupMembergetProfileImage, group_member_add_phone, getGroupInfo, getGroupHeadContact, group_member_add_education } = require('../../modules/group-member-login/controller');
const { initGroupMemberGridFS, getUploadMiddleware } = require('../../configurations/firebase_Configuraion/memberProfileImageGridFs');
const authMiddleware = require('../Authentication_middleware/authMiddleware');
const checkGroupInfo = require('./checkGroupInfoMiddleware');
const validatePhoneNumber = require("./groupMemberPhoneNumberMiddleware")

let upload;

// Ensure `upload` is initialized
initGroupMemberGridFS()
  .then(({ upload: initializedUpload }) => {
    upload = initializedUpload;
    console.log('Upload middleware initialized for router');
  })
  .catch((err) => console.error('Error initializing GridFS for router:', err));


// POST route for login
router.post('/member-login', emailValidation, passwordValidation, login);

// POST route for uploading group member profile image
router.post(
  '/member-upload-profile-image/:memberId',
  groupmemberAuthMiddleware, // JWT authentication middleware
  async (req, res, next) => {
    const upload = getUploadMiddleware();

    if (!upload) {
      return res.status(500).json({ message: 'Upload middleware not initialized' });
    }

  

    // Apply the upload middleware
    upload.single('file')(req, res, next);
  },
  groupMemberuploadProfileImage // Final route handler
);

// GET route for retrieving group member profile image
router.get('/profile-image/:profileImage', groupmemberAuthMiddleware, groupMembergetProfileImage);

router.get('/group-info/:addedBy',groupmemberAuthMiddleware, checkGroupInfo, getGroupInfo);

router.get('/group-head-contact/:addedById',groupmemberAuthMiddleware,getGroupHeadContact, );

router.put("/group-member-education/:groupMemberId/education",groupmemberAuthMiddleware,  group_member_add_education);

router.get("/group-member/education/:groupMemberId",groupmemberAuthMiddleware, get_group_member_education)

router.delete("/group-member-remove/education",groupmemberAuthMiddleware, delete_group_member_education);

router.post("/group-member-phone/:groupMemberId",groupmemberAuthMiddleware,validatePhoneNumber, group_member_add_phone);

module.exports = router;
