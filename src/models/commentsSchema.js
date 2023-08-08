const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostModel', 
  },
  comment: {
    type: String,
    required: true,
  },
});

const CommentModel = mongoose.model('CommentModel', commentSchema);

module.exports = CommentModel;
