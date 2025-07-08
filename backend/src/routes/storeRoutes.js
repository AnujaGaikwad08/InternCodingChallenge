const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// Admin: add store
router.post('/', authenticateJWT, authorizeRoles('admin'), storeController.addStore);
// Admin/User: view/search stores
router.get('/', authenticateJWT, authorizeRoles('admin', 'user', 'owner'), storeController.getStores);
// Owner: view ratings for their store
router.get('/:storeId/ratings', authenticateJWT, authorizeRoles('owner'), storeController.getStoreRatings);
// Add this route for store owner dashboard
router.get('/store-owner/dashboard', authenticateJWT, authorizeRoles('owner'), storeController.ownerDashboard);
router.put('/store-owner/update-password', authenticateJWT, authorizeRoles('owner'), storeController.ownerUpdatePassword);

module.exports = router; 