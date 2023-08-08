const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const postSchema = new mongoose.Schema({
  postId: { type: String, default: uuidv4, unique: true },
  user: { type: String, default: 'User' },
  text: { type: String },
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;