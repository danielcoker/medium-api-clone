import mongoose from 'mongoose';
import slugify from 'slugify';
import ErrorResponse from '../utils/errorResponse';

const { Schema } = mongoose;

const opts = {
  toJSON: { virtuals: true },
  timestamps: true
};

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    body: { type: String, required: true },
    slug: { type: String },
    favouritesCount: { type: Number, default: 0 },
    author: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  opts
);

/**
 * @desc Create article slug on save.
 */
ArticleSchema.pre('save', async function(next) {
  if (!this.isModified('title')) next();

  let slugExists = true;

  let slug = createSlug(this.title);

  let counter = 1;

  while (slugExists) {
    const dbSlug = await this.constructor.findOne({ slug });

    if (dbSlug) {
      if (counter == 1) {
        slug = slug.concat(`-${counter}`);
      } else {
        slug = incrementSlugNumber(slug);
      }

      slugExists = true;
    } else {
      this.slug = slug;
      slugExists = false;
    }

    counter++;
  }
  next();
});

/**
 * @desc Check if user is the author of an article.
 * @returns {object} User.
 */
ArticleSchema.methods.isAuthoredBy = function(user) {
  return this.author.equals(user);
};

/**
 * @desc Create slug from title.
 */
const createSlug = title => {
  const slug = slugify(title, { lower: true });
  return slug;
};

/**
 * @desc Increment number at the end of slug.
 */
const incrementSlugNumber = slug => {
  let slugArray = slug.split('-');
  let slugNumber = parseInt(slugArray.pop(), 10);
  slugNumber++;
  slugArray.push(slugNumber);
  slug = slugArray.join('-');

  return slug;
};

const Article = mongoose.model('Article', ArticleSchema);

export default Article;
