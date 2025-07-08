const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// User: submit or update rating
router.post('/:storeId', authenticateJWT, authorizeRoles('user'), ratingController.submitOrUpdateRating);
// User: view their ratings
router.get('/my', authenticateJWT, authorizeRoles('user'), ratingController.getUserRatings);

module.exports = router; 