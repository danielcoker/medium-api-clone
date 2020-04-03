import mongoose from 'mongoose';

const { Schema } = mongoose;

const FollowerSchema = new Schema({
  leader: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  follower: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

const Follower = mongoose.model('Follower', FollowerSchema);

export default Follower;
