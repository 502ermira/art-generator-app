const Post = require('../models/Post');
const Follower = require('../models/Follower');
const PostView = require('../models/PostView');
const User = require('../models/User');
const Repost = require('../models/Repost');
const Comment = require('../models/Comment');
const Search = require('../models/Search');
const Like = require('../models/Like');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

exports.getRelevantPosts = async (req, res) => {
  const userId = req.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const user = await User.findById(userId).select('blockedUsers blockedBy');
    const blockedUserIds = user.blockedUsers.concat(user.blockedBy);

    const following = await Follower.find({ followerId: userId }).select('followingId');
    const followedUserIds = following.map(f => f.followingId);

    const followedPosts = await Post.find({ 
        user: { $in: followedUserIds, $nin: blockedUserIds }
      })
      .populate('user')
      .populate('image')
      .sort({ sharedAt: -1 })
      .skip(skip)
      .limit(limit / 2); 

    const additionalPosts = await Post.find({
      user: { $nin: followedUserIds.concat(blockedUserIds) }
    })
      .populate('user')
      .populate('image')
      .sort({ sharedAt: -1 })
      .skip(skip)
      .limit(limit / 2); 

    const allPosts = [...followedPosts, ...additionalPosts];

    const scoredPosts = await Promise.all(
      allPosts.map(async (post) => {
        const engagementScore = await getEngagementScore(post._id);

        let relevanceScore;
        try {
          relevanceScore = await getRelevanceScore(post, userId);
        } catch (error) {
          console.error(`Failed to fetch relevance score for user ${userId}:`, error);
          relevanceScore = 0;
        }

        const recencyScore = new Date() - post.sharedAt;

        const likesCount = await Like.countDocuments({ post: post._id });
        const commentsCount = await Comment.countDocuments({ post: post._id });
        const repostsCount = await Repost.countDocuments({ post: post._id });

        const isLikedByUser = await Like.exists({ post: post._id, user: userId });
        const isRepostedByUser = await Repost.exists({ post: post._id, user: userId });

        const finalScore = (engagementScore * 0.3) + (relevanceScore * 0.5) - (recencyScore * 0.2);

        return {
          post: {
            ...post.toObject(),
            likes: likesCount,
            comments: commentsCount,
            reposts: repostsCount,
            isLikedByUser,
            isRepostedByUser
          },
          finalScore
        };
      })
    );

    scoredPosts.sort((a, b) => b.finalScore - a.finalScore);
    return res.json(scoredPosts.map(sp => sp.post));
  } catch (error) {
    console.error('Error fetching relevant posts:', error);
    return res.status(500).json({ error: 'Unable to get posts.' });
  }
};

exports.getPopularizedPosts = async (req, res) => {
  const userId = req.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const user = await User.findById(userId).select('blockedUsers blockedBy');
    const blockedUserIds = user.blockedUsers.concat(user.blockedBy);

    const following = await Follower.find({ followerId: userId }).select('followingId');
    const followedUserIds = following.map(f => f.followingId);

    const popularPosts = await Post.find({ 
      user: { $nin: [...followedUserIds, userId, ...blockedUserIds] } 
    })
      .populate('user')
      .populate('image')
      .sort({ sharedAt: -1 })
      .skip(skip)
      .limit(limit);

    const scoredPosts = await Promise.all(
      popularPosts.map(async (post) => {
        const engagementScore = await getEngagementScore(post._id);
        const recencyScore = new Date() - post.sharedAt;

        const finalScore = (engagementScore * 0.7) - (recencyScore * 0.3);
        return { post, finalScore };
      })
    );

    scoredPosts.sort((a, b) => b.finalScore - a.finalScore);

    return res.json(scoredPosts.map(sp => sp.post));
  } catch (error) {
    console.error('Error fetching popularized posts:', error);
    return res.status(500).json({ error: 'Unable to get posts.' });
  }
};

const getEngagementScore = async (postId) => {
  const viewCount = await PostView.countDocuments({ post: postId });
  const commentCount = await Comment.countDocuments({ post: postId });
  const repostCount = await Repost.countDocuments({ post: postId });
  const likeCount = await Like.countDocuments({ post: postId });
  return likeCount + viewCount + (commentCount * 2) + (repostCount * 3);
}

const getRelevanceScore = async (post, userId) => {
  const fetch = (await import('node-fetch')).default;

  const userRecentSearch = await Search.findOne({ user: userId }).sort({ timestamp: -1 });

  if (!userRecentSearch) {
    console.warn(`No search history found for user ${userId}. Assigning default relevance score.`);
    return 0;
  }

  const query = userRecentSearch ? userRecentSearch.query : post.description;

  try {
    const response = await fetch('http://192.168.1.145:5001/search-pagination', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch relevance score from microservice');
    }

    const searchResults = await response.json();
    const isRelevant = searchResults.results.some(result => result.id === post.image._id.toString());

    return isRelevant ? 10 : 0;

  } catch (error) {
    console.error(`Error fetching relevance score: ${error.message}`);
    
    const postDescription = post.description.toLowerCase();
    const relevanceFallback = query.toLowerCase().split(' ').some(keyword => postDescription.includes(keyword)) ? 5 : 0;

    return relevanceFallback;
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }

    await Comment.deleteMany({ post: postId });
    await Like.deleteMany({ post: postId });
    await Repost.deleteMany({ post: postId });
    await PostView.deleteMany({ post: postId });
    await Notification.deleteMany({ post: postId });
    await User.updateMany({ posts: postId }, { $pull: { posts: postId } });
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post and related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};