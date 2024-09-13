const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    const user = await User.findById(req.userId).select('fullname username email profilePicture');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
