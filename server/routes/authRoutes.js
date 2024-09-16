const express = require('express');
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/favorites', authenticateUser, authController.getFavorites);
router.post('/favorites', authenticateUser, authController.addFavorite);
router.get('/profile', authenticateUser, authController.getProfile);
router.put('/profile', authenticateUser, authController.updateProfile);
router.put('/change-password', authenticateUser, authController.changePassword);
router.post('/share', authenticateUser, authController.postImage);
router.get('/search-users', authenticateUser, authController.searchUsers);
router.get('/user/:username', authenticateUser, authController.getUserProfileByUsername);
router.post('/follow/:username', authenticateUser, authController.followUser);
router.get('/follow-count/:username', authController.getFollowCount);

module.exports = router;