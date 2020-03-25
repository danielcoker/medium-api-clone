import mongoose from 'mongoose';

const connect = async () => {
  await mongoose.connect(
    global.__MONGO_URI__,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    }
  );
};

const close = async () => {
  await mongoose.connection.close();
};

export default { connect, close };
