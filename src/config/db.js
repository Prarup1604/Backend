
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // By default, Mongoose will create the database if it doesn't exist upon the first write operation.
    await mongoose.connect('mongodb://localhost:27017/qr_payment');
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection lost');
  });
};

module.exports = connectDB;
