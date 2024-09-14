const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  profilePicture: { type: String },
  favorites: [{ type: String }],
  posts: [{ type: String }],
});

module.exports = mongoose.model('User', userSchema);