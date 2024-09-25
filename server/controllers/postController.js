const Post = require('../models/Post');
const Follower = require('../models/Follower');
const PostView = require('../models/PostView');
const User = require('../models/User');
const Repost = require('../models/Repost');
const Comment = require('../models/Comment');
const Search = require('../models/Search');
const Like = require('../models/Like');

exports.getRelevantPosts = async (req, res) => {
  const userId = req.userId;
  try {
    const following = await Follower.find({ followerId: userId }).select('followingId');
    const followedUserIds = following.map(f => f.followingId);

    const followedPosts = await Post.find({ user: { $in: followedUserIds } })
      .populate('user')
      .populate('image')
      .sort({ sharedAt: -1 })
      .limit(20);

      const additionalPosts = await Post.find({
        user: { $nin: followedUserIds },
      })
       .populate('user')
       .populate('image')
       .sort({ sharedAt: -1 })
       .limit(20);


    const allPosts = [...followedPosts, ...additionalPosts];

    const scoredPosts = await Promise.all(
      allPosts.map(async (post) => {
        const engagementScore = await getEngagementScore(post._id);
        const relevanceScore = await getRelevanceScore(post, userId);
        const recencyScore = new Date() - post.sharedAt;
        
        const finalScore = (engagementScore * 0.3) + (relevanceScore * 0.5) - (recencyScore * 0.2);
        return { post, finalScore };
      })
    );

    scoredPosts.sort((a, b) => b.finalScore - a.finalScore);
    return res.json(scoredPosts.map(sp => sp.post));
  } catch (error) {
    console.error('Error fetching relevant posts:', error);
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
  const query = userRecentSearch ? userRecentSearch.query : post.description;

  const response = await fetch('http://192.168.1.145:5001/search', {
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
}