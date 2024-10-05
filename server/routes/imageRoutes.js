const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const postController = require('../controllers/postController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/generate-image', imageController.generateImage);
router.post('/search', authenticateUser, imageController.searchImages);
router.get('/posts/relevant', authenticateUser, postController.getRelevantPosts);
router.get('/posts/explore', authenticateUser, postController.getPopularizedPosts);

module.exports = router;