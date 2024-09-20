const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const notificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fromUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
  });
  
module.exports = mongoose.model('Notification', notificationSchema);