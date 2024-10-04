const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    minlength: 3, 
    maxlength: 17
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email address']
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 8
  },
  fullname: { 
    type: String, 
    required: true, 
    minlength: 3, 
    maxlength: 25
  },
  profilePicture: { 
    type: String, 
    default: 'https://t3.ftcdn.net/jpg/05/66/32/22/360_F_566322207_Fa1DSykWMr5IjvNFFdgKapoCHJn36RgV.jpg'
  },
  bio: { 
    type: String, 
    maxlength: 150
  },
  favorites: [{ type: String }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: [] }],
});

module.exports = mongoose.model('User', userSchema);