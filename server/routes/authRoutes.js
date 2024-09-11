const express = require('express');
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/favorites', authenticateUser, authController.getFavorites);
router.post('/favorites', authenticateUser, authController.addFavorite);

module.exports = router;