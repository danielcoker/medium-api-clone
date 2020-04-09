import mongoose from 'mongoose';

const { Schema } = mongoose;

const opts = {
  toJSON: { virtuals: true },
  timestamps: true,
};

const CommentSchema = new Schema(
  {
    body: { type: String, required: true },
    article: {
      type: Schema.ObjectId,
      ref: 'Article',
      required: true,
    },
    author: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  opts
);

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
