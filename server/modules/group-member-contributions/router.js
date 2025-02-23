// routes/contributionsRoutes.js
const express = require("express");
const {createContributions, get_group_member_contribution} = require('./controller');
const validateResearchInterests = require('./middleware');


const router = express.Router();

// Create contributions
router.post('/group-member/create/contribution', validateResearchInterests, createContributions);
router.get('/group-member/get/contribution/:groupMemberId',  get_group_member_contribution);

module.exports = router;