const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', authenticateJWT, authorizeRoles('admin'), userController.addUser);
router.get('/', authenticateJWT, authorizeRoles('admin'), userController.getUsers);

module.exports = router; 