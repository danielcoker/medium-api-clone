import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema } = mongoose;

const TaskSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

TaskSchema.pre('save', function(next) {
  this.slug = createSlug(this.title);
  next();
});

TaskSchema.pre('updateOne', function(next) {
  console.log('Running pre upadte');
  const title = this.getUpdate().$set.title;

  if (!title) {
    return next();
  }

  try {
    this.slug = createSlug(title);
  } catch (error) {
    return next(error);
  }
});

/**
 * @desc Create slug from title.
 */
const createSlug = title => {
  const slug = slugify(title, { lower: true });
  return slug;
};

const Task = mongoose.model('Task', TaskSchema);

export default Task;
