const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/stats', authenticateJWT, authorizeRoles('admin'), dashboardController.getStats);

module.exports = router; 