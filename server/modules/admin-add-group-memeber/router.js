const express = require('express');
const router = express.Router();

const {
  addGroupMember,
  getMyGroupMembers,
  updateGroupMember,
  removeGroupMember,
  groupMembergetProfileImage


} = require('../admin-add-group-memeber/controller');
const authMiddleware = require('../Authentication_middleware/authMiddleware');
const  memeberPasswordValidation  = require('./memberPasswordMiddleware'); // Adjust path accordingly


// Add a new group member
router.post('/group-member-add', authMiddleware, addGroupMember);

// Get all group members added by the logged-in user
router.get('/my-members', authMiddleware, getMyGroupMembers);

// Remove a group member
router.post('/group-member-remove', authMiddleware, removeGroupMember);

router.get('/head-user-group-member-profile-image/:profileImage', authMiddleware, groupMembergetProfileImage);


router.put('/group-member-update/:id', authMiddleware, memeberPasswordValidation, updateGroupMember);

module.exports = router;
