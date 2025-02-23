const express = require('express');
const router = express.Router();
const { checkUserResearchInfo } = require('../check-group-information/controller'); // Adjust the path
const  authMiddleware  = require('../Authentication_middleware/authMiddleware'); // Adjust the path as necessary

// Define the route to check user research information
router.get('/research/check-permission/:userId',authMiddleware, checkUserResearchInfo);

module.exports = router;