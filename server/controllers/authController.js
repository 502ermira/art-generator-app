const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Follower = require('../models/Follower');

exports.signup = async (req, res) => {
  const { username, email, password, fullname, profilePicture } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultProfilePicture = 'https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg';
    const finalProfilePicture = profilePicture || defaultProfilePicture;

    const user = new User({
      username,
      email,
      password: hashedPassword,
      fullname, 
      profilePicture: finalProfilePicture
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, username: user.username });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  };  

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

exports.addFavorite = async (req, res) => {
  const { image } = req.body;
  try {
    const user = await User.findById(req.userId);
    user.favorites.push(image);
    await user.save();
    res.json({ message: 'Favorite added', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('fullname username email profilePicture posts');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

exports.updateProfile = async (req, res) => {
  const { fullname, profilePicture, username, email } = req.body;

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

    Object.assign(user, updates);
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', updates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
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

exports.postImage = async (req, res) => {
  const { image } = req.body;
  const { authorization } = req.headers;

  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    user.posts.push(image);
    await user.save();

    res.status(200).json({ message: 'Image shared successfully', posts: user.posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.searchUsers = async (req, res) => {
  const { searchQuery } = req.query;

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

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search users' });
  }
};

exports.getUserProfileByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select('fullname username profilePicture posts');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
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
    res.status(200).json({ message: 'Followed successfully' });
  } catch (error) {
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

