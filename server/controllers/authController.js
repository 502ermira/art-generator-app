const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Follower = require('../models/Follower');
const Image = require('../models/Image');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Repost = require('../models/Repost');
const Notification = require('../models/Notification');
const { sendNotification } = require('../services/notificationService');
const Search = require('../models/Search');
const PostView = require('../models/PostView');
const { bucket } = require('../firebaseAdmin');
const { Buffer } = require('buffer');

exports.signup = async (req, res) => {
  const { username, email, password, fullname, profilePicture, bio } = req.body;

  if (!username || !email || !password || !fullname) {
    return res.status(400).json({ error: 'All fields except profile picture and bio are required' });
  }

  let firebaseUrl = profilePicture || 'https://t3.ftcdn.net/jpg/05/66/32/22/360_F_566322207_Fa1DSykWMr5IjvNFFdgKapoCHJn36RgV.jpg';

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username is already in use' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (profilePicture) {
      const base64EncodedImageString = profilePicture.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');

      const fileName = `profilePictures/${Date.now()}_${username}.jpg`;
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: { contentType: 'image/jpeg' },
      });

      blobStream.on('error', (err) => {
        console.error('Error uploading file to Firebase:', err);
        return res.status(500).json({ error: 'Failed to upload image' });
      });

      blobStream.on('finish', async () => {
        await blob.makePublic();
        firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        const user = new User({
          username,
          email,
          password: hashedPassword,
          fullname,
          profilePicture: firebaseUrl,
          bio,
        });

        await user.save();
        return res.status(201).json({ message: 'User registered successfully', profilePicture: firebaseUrl });
      });

      blobStream.end(imageBuffer);
    } else {
      const user = new User({
        username,
        email,
        password: hashedPassword,
        fullname,
        profilePicture: firebaseUrl,
        bio,
      });

      await user.save();
      res.status(201).json({ message: 'User registered successfully', profilePicture: firebaseUrl });
    }
  } catch (error) {
    console.error('Error during signup process:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.json({ token, username: user.username });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  };  

  exports.getFavorites = async (req, res) => {
    try {
      const user = await User.findById(req.userId).populate('favorites');
      res.json({ favorites: user.favorites });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  };
  
  exports.saveFavorite = async (req, res) => {
    const { image } = req.body;
    const { authorization } = req.headers;
  
    try {
      const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      const isFavorite = user.favorites.includes(image);
      if (isFavorite) {
        return res.status(400).json({ error: 'Image is already a favorite' });
      }
  
      user.favorites.push(image);
      await user.save();
  
      res.status(200).json({ message: 'Favorite saved successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };    

  exports.getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.userId)
        .select('fullname username email profilePicture bio');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);

    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  };  

  exports.postImage = async (req, res) => {
    const { image, description } = req.body;
    const { authorization } = req.headers;
  
    try {
      const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      let existingImage = await Image.findOne({ image: image.url });
      
      if (!existingImage) {
        existingImage = new Image({
          prompt: image.prompt,
          image: image.url,
          user: user._id,
        });
  
        await existingImage.save();
      }
  
      const newPost = new Post({
        image: existingImage._id,
        description,
        user: user._id
      });
  
      await newPost.save();
  
      if (!user.posts) {
        user.posts = [];
      }
      user.posts.push(newPost._id);
      await user.save();
  
      res.status(200).json({ message: 'Image shared successfully', post: newPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };  

exports.searchUsers = async (req, res) => {
  const { searchQuery } = req.query;
  const userId = req.userId;

  if (!searchQuery) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: searchQuery, $options: 'i' } },
        { fullname: { $regex: searchQuery, $options: 'i' } }
      ]
    }).select('username fullname profilePicture');

    if (userId) {
      await Search.create({ user: userId, query: searchQuery, type: 'users' });
    }
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search users' });
  }
};

exports.getUserProfileByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username })
      .select('fullname username profilePicture posts bio')
      .populate({
        path: 'posts',
        populate: {
          path: 'image',
          model: 'Image',
          select: 'image',
        },
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const reposts = await Repost.find({ user: user._id })
      .populate({
        path: 'post',
        populate: {
          path: 'image',
          model: 'Image',
          select: 'image',
        },
      });

    res.json({ user, reposts });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

exports.getUserPosts = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select('posts');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ _id: { $in: user.posts } })
      .populate({
        path: 'image',
        model: 'Image',
        select: 'image',
      });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
};

exports.getPostById = async (req, res) => {
  const { postId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const post = await Post.findById(postId)
      .populate('image', 'image prompt')
      .populate('user', 'username fullname profilePicture');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingPostView = await PostView.findOne({ post: postId, user: user._id });

    if (existingPostView) {
      existingPostView.viewCount += 1;
      existingPostView.viewedAt = Date.now();
      await existingPostView.save();
    } else {
      await PostView.create({
        post: postId,
        user: user._id,
        viewedAt: Date.now(),
        viewCount: 1,
      });
    }

    const likesCount = await Like.countDocuments({ post: postId });
    const repostsCount = await Repost.countDocuments({ post: postId });
    const isLikedByUser = await Like.findOne({ post: postId, user: user._id });

    res.json({
      ...post.toObject(),
      likes: likesCount,
      reposts: repostsCount,
      isLikedByUser: !!isLikedByUser,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

exports.followUser = async (req, res) => {
  const { userId: followerId } = req;
  const { username } = req.params;

  try {
    const followingUser = await User.findOne({ username });
    if (!followingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const alreadyFollowing = await Follower.findOne({
      followerId,
      followingId: followingUser._id,
    });

    if (alreadyFollowing) {
      return res.status(400).json({ error: 'You are already following this user' });
    }

    const newFollow = new Follower({
      followerId,
      followingId: followingUser._id,
    });
    await newFollow.save();

    await Notification.deleteMany({
      user: followingUser._id,
      fromUser: followerId,
      type: 'follow',
    });

    const followerUser = await User.findById(followerId);

    const notification = new Notification({
      user: followingUser._id,
      fromUser: followerId,
      message: `${followerUser.username} started following you`,
      type: 'follow',
    });
    await notification.save();

    const populatedNotification = await Notification.findById(notification._id)
      .populate('fromUser', 'username profilePicture fullname')
      .exec();  

    if (populatedNotification) {
      sendNotification(followingUser.username, {
        message: populatedNotification.message,
        type: 'follow',
        fromUser: populatedNotification.fromUser,
        createdAt: populatedNotification.createdAt,
      });
    }

    res.status(200).json({ message: 'Followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
};

exports.getFollowCount = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followCount = await Follower.countDocuments({ followingId: user._id });
    res.json({ followCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch follow count' });
  }
};

exports.getFollowersAndFollowing = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followers = await Follower.find({ followingId: user._id }).populate('followerId', 'username fullname profilePicture');
    
    const following = await Follower.find({ followerId: user._id }).populate('followingId', 'username fullname profilePicture');

    res.json({ followers, following });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch followers/following' });
  }
};

exports.unfollowUser = async (req, res) => {
  const { userId: followerId } = req;
  const { username } = req.params;

  try {
    const followingUser = await User.findOne({ username });
    if (!followingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followRecord = await Follower.findOneAndDelete({
      followerId,
      followingId: followingUser._id,
    });

    if (!followRecord) {
      return res.status(400).json({ error: 'You are not following this user' });
    }

     await Notification.deleteMany({
      user: followingUser._id,
      fromUser: followerId,
      type: 'follow',
    });

    res.status(200).json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};

exports.updateProfile = async (req, res) => {
  const { fullname, profilePicture, username, email, bio } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates = {};

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      updates.username = username;
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      updates.email = email;
    }

    if (fullname && fullname !== user.fullname) {
      updates.fullname = fullname;
    }

    if (bio && bio !== user.bio) {
      updates.bio = bio;
    }

    if (profilePicture && profilePicture.startsWith('data:image')) {
      const base64EncodedImageString = profilePicture.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');

      const fileName = `profilePictures/${Date.now()}_${username}.jpg`;
      const blob = bucket.file(fileName);

      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: 'image/jpeg',
        },
      });

      blobStream.on('error', (err) => {
        console.error('Error uploading file to Firebase:', err);
        return res.status(500).json({ error: 'Failed to upload image' });
      });

      blobStream.on('finish', async () => {
        await blob.makePublic();

        const firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        updates.profilePicture = firebaseUrl;

        Object.assign(user, updates);
        await user.save();

        res.status(200).json({
          message: 'Profile updated successfully',
          profilePicture: firebaseUrl,
          updates,
        });
      });
      
      blobStream.end(imageBuffer);
    } else {
      Object.assign(user, updates);
      await user.save();
      res.status(200).json({
        message: 'Profile updated successfully',
        updates,
      });
    }
  } catch (error) {
    console.error('Error during profile update:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.updateUsername = async (req, res) => {
  const { username } = req.body;

  if (!username || username.length < 3 || username.length > 18) {
    return res.status(400).json({ error: 'Username must be between 3 and 18 characters' });
  }

  try {
    const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    if (user) {
      return res.status(409).json({ error: 'Username already taken' });
    }
    res.status(200).json({ message: 'Username available' });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateEmail = async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (user) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    res.status(200).json({ message: 'Email available' });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect old password' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' });
  }
};

exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const post = await Post.findById(postId).populate('user', 'username');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingLike = await Like.findOne({ post: postId, user: user._id });
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      await Notification.deleteOne({ post: postId, fromUser: user._id, type: 'like' });
      return res.status(200).json({ message: 'Post unliked' });
    }

    const newLike = new Like({ post: postId, user: user._id });
    await newLike.save();

    const existingNotification = await Notification.findOne({
      post: postId,
      fromUser: user._id,
      type: 'like',
    });

    if (existingNotification) {
      existingNotification.createdAt = Date.now();
      await existingNotification.save();
    } else {
      if (post.user && post.user.toString() !== user._id.toString()) {
        const notification = new Notification({
          user: post.user,
          fromUser: user._id,
          post: postId,
          message: `${user.username} liked your post`,
          type: 'like',
        });
        await notification.save();

        const populatedNotification = await Notification.findById(notification._id)
          .populate('fromUser', 'username profilePicture')
          .populate({
            path: 'post',
            populate: { path: 'image', model: 'Image', select: 'image' },
          })
          .exec();

        if (populatedNotification) {
          sendNotification(post.user.username, {
            message: populatedNotification.message,
            type: 'like',
            postId: postId,
            fromUser: populatedNotification.fromUser,
            createdAt: populatedNotification.createdAt,
            post: populatedNotification.post,
          });
        }
      }
    }

    res.status(201).json({ message: 'Post liked', like: newLike });
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLikesByPostId = async (req, res) => {
  const { postId } = req.params;

  if (!postId || postId.length !== 24) {
    return res.status(400).json({ error: 'Invalid postId' });
  }

  try {
    const likes = await Like.find({ post: postId })
      .populate('user', 'username fullname profilePicture');

    res.json({ likers: likes.map(like => like.user) });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
};

exports.getCommentsByPostId = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId })
      .populate('user', 'username fullname profilePicture')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

exports.addCommentToPost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const { authorization } = req.headers;

  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const post = await Post.findById(postId).populate('user', 'username');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const mentionedUsernames = content.match(/@(\w+)/g)?.map((m) => m.slice(1)) || [];
    const mentionedUsers = await User.find({ username: { $in: mentionedUsernames } });

    const newComment = new Comment({
      post: postId,
      user: user._id,
      content,
      mentions: mentionedUsers.map((u) => u._id),
    });
    await newComment.save();

    if (post.user._id.toString() !== user._id.toString()) {
      const notification = new Notification({
        user: post.user._id,
        fromUser: user._id,
        post: postId,
        comment: newComment._id,
        message: `${user.username} commented on your post: "${content.slice(0, 100)}..."`,
        type: 'comment',
      });
      await notification.save();

      const populatedNotification = await Notification.findById(notification._id)
        .populate('fromUser', 'username profilePicture')
        .populate({
          path: 'post',
          populate: { path: 'image', model: 'Image', select: 'image' },
        })
        .populate('comment', 'content') 
        .exec();

      if (populatedNotification) {
        sendNotification(post.user.username, {
          message: populatedNotification.message,
          type: 'comment',
          postId: postId,
          fromUser: populatedNotification.fromUser,
          createdAt: populatedNotification.createdAt,
          post: populatedNotification.post,
          comment: populatedNotification.comment,
        });
      }
    }

    for (const mentionedUser of mentionedUsers) {
      const notification = new Notification({
        user: mentionedUser._id,
        fromUser: user._id,
        post: postId,
        comment: newComment._id,
        message: `${user.username} mentioned you in a comment: "${content.slice(0, 100)}..."`,
        type: 'mention',
      });
      await notification.save();

      const populatedNotification = await Notification.findById(notification._id)
        .populate('fromUser', 'username profilePicture')
        .populate({
          path: 'post',
          populate: { path: 'image', model: 'Image', select: 'image' },
        })
        .exec();

      if (populatedNotification) {
        sendNotification(mentionedUser.username, {
          message: populatedNotification.message,
          type: 'mention',
          postId: postId,
          fromUser: populatedNotification.fromUser,
          createdAt: populatedNotification.createdAt,
          post: populatedNotification.post,
        });
      }
    }

    res.status(201).json({ message: 'Comment added', comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);

    await Notification.deleteMany({
      comment: commentId,
    });

    res.json({ success: true, message: 'Comment and related notifications deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

exports.repostPost = async (req, res) => {
  const { postId } = req.params;
  const { authorization } = req.headers;

  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const post = await Post.findById(postId).populate('user', 'username');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingRepost = await Repost.findOne({ user: user._id, post: postId });

    if (existingRepost) {
      await Repost.deleteOne({ _id: existingRepost._id });
      await Notification.deleteOne({ post: postId, fromUser: user._id, type: 'repost' });
      return res.status(200).json({ message: 'Post unreposted successfully' });
    }

    const repost = new Repost({ user: user._id, post: postId });
    await repost.save();

    const existingNotification = await Notification.findOne({
      post: postId,
      fromUser: user._id,
      type: 'repost',
    });

    if (existingNotification) {
      existingNotification.createdAt = Date.now();
      await existingNotification.save();
    } else {
      if (post.user && post.user._id.toString() !== user._id.toString()) {
        const notification = new Notification({
          user: post.user._id,
          fromUser: user._id,
          post: postId,
          message: `${user.username} reposted your post`,
          type: 'repost',
        });
        await notification.save();

        const populatedNotification = await Notification.findById(notification._id)
          .populate('fromUser', 'username profilePicture')
          .populate({
            path: 'post',
            populate: { path: 'image', model: 'Image', select: 'image' },
          })
          .exec();

        if (populatedNotification) {
          sendNotification(post.user.username, {
            message: populatedNotification.message,
            type: 'repost',
            postId: postId,
            fromUser: populatedNotification.fromUser,
            createdAt: populatedNotification.createdAt,
            post: populatedNotification.post,
          });
        }
      }
    }

    res.status(201).json({ message: 'Post reposted successfully', repost });
  } catch (error) {
    console.error('Error reposting post:', error);
    res.status(500).json({ error: 'Failed to repost post' });
  }
};

exports.getReposts = async (req, res) => {
  const { postId } = req.params;

  try {
    const reposts = await Repost.find({ post: postId })
      .populate('user', 'username fullname profilePicture')
      .sort({ repostedAt: -1 });

    res.json(reposts);
  } catch (error) {
    console.error('Error fetching reposts:', error);
    res.status(500).json({ error: 'Failed to fetch reposts' });
  }
};

exports.getRepostsByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const reposts = await Repost.find({ user: user._id })
      .populate({
        path: 'post',
        populate: {
          path: 'image',
          model: 'Image',
          select: 'image',
        },
      });

    res.json(reposts);
  } catch (error) {
    console.error('Error fetching reposts:', error);
    res.status(500).json({ error: 'Failed to fetch reposts' });
  }
};

exports.getNotifications = async (req, res) => {
  const { authorization } = req.headers;

  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ error: 'User not found' });

    let notifications = await Notification.find({ user: user._id })
      .populate('fromUser', 'username profilePicture fullname')
      .populate({
        path: 'post',
        populate: { path: 'image', model: 'Image', select: 'image' },
      })
      .populate('comment', 'content')
      .sort({ createdAt: -1 });

    notifications = notifications.filter(notification => {
      if (notification.type === 'comment' || notification.type === 'mention') {
        return notification.post && notification.post._id;
      }
      return true;
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.suggestUsers = async (req, res) => {
  const { searchTerm } = req.query;

  try {
    const users = await User.find({ username: { $regex: `^${searchTerm}`, $options: 'i' } })
                            .limit(10)
                            .select('username fullname profilePicture');
    res.json(users);
  } catch (error) {
    console.error('Error fetching user suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch user suggestions' });
  }
};

exports.getLikedPosts = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const likedPosts = await Like.find({ user: user._id })
      .populate({
        path: 'post',
        populate: { path: 'image', model: 'Image' },
      })
      .sort({ likedAt: -1 })
      .exec();

    if (!likedPosts) {
      return res.status(404).json({ error: 'No liked posts found' });
    }

    res.json(likedPosts);
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    res.status(500).json({ error: 'Failed to fetch liked posts' });
  }
};