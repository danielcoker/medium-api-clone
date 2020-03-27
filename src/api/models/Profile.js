import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProfileSchema = new Schema({
  bio: { type: String },
  image: { type: String, default: 'no-photo.jpeg' },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;
