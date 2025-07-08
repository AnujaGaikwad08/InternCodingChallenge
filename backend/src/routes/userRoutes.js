const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateJWT, authorizeRoles('admin'), userController.addUser);
router.get('/', authenticateJWT, authorizeRoles('admin'), userController.getUsers);
router.put('/password', authenticateJWT, authorizeRoles('user', 'owner', 'admin'), userController.updatePassword);

module.exports = router; 