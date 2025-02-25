// routes/contributionsRoutes.js
const express = require("express");
const {createContributions, get_group_member_contribution, update_group_member_contribution} = require('./controller');
const validateResearchInterests = require('./middleware');
const { groupmemberAuthMiddleware } = require('../group-member-login/groupMemberAuthMiddleware');





const router = express.Router();
console.log("createContributions:", typeof createContributions);
console.log("get_group_member_contribution:", typeof get_group_member_contribution);
console.log("update_group_member_contribution:", typeof update_group_member_contribution);
console.log("groupMemberAuthMiddleware:", typeof groupMemberAuthMiddleware);


// Create contributions
router.post('/group-member/create/contribution', groupmemberAuthMiddleware, validateResearchInterests,  createContributions);
router.get('/group-member/get/contribution/:groupMemberId',groupmemberAuthMiddleware,  get_group_member_contribution);
router.put('/group-member/update/contribution/:groupMemberId',groupmemberAuthMiddleware,  update_group_member_contribution);

module.exports = router;