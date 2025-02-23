const express = require('express');
const { addOrUpdateResearch, getResearch } = require('./controller');
const authMiddleware = require('../Authentication_middleware/authMiddleware');
const router = express.Router();


router.get('/get-reseach-information', authMiddleware, getResearch);
router.put('/reseach-information', authMiddleware, addOrUpdateResearch);



module.exports = router;