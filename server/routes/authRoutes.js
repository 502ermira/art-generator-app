const express = require('express');
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/favorites', authenticateUser, authController.getFavorites);
router.post('/favorites', authenticateUser, authController.addFavorite);
router.get('/profile', authenticateUser, authController.getProfile);
router.post('/share', authenticateUser, authController.postImage);
router.get('/user/:username', authenticateUser, authController.getUserProfileByUsername);
router.put('/profile', authenticateUser, authController.updateProfile);
router.put('/change-password', authenticateUser, authController.changePassword);
router.get('/search-users', authenticateUser, authController.searchUsers);
router.post('/follow/:username', authenticateUser, authController.followUser);
router.get('/follow-count/:username', authController.getFollowCount);
router.get('/followers-following/:username', authController.getFollowersAndFollowing);
router.post('/unfollow/:username', authenticateUser, authController.unfollowUser);
router.get('/user/:username/posts', authenticateUser, authController.getUserPosts);
router.get('/posts/:postId', authenticateUser, authController.getPostById);
router.post('/posts/:postId/like', authenticateUser, authController.likePost);
router.get('/posts/:postId/likes', authenticateUser, authController.getLikesByPostId);
router.get('/posts/:postId/comments', authenticateUser, authController.getCommentsByPostId);
router.post('/posts/:postId/comments', authenticateUser, authController.addCommentToPost);
router.post('/posts/:postId/repost', authenticateUser, authController.repostPost);
router.get('/posts/:postId/reposts', authenticateUser, authController.getReposts);
router.get('/user/:username/reposts', authenticateUser, authController.getRepostsByUsername);
router.get('/notifications', authenticateUser, authController.getNotifications);

module.exports = router;