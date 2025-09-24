const Transaction = require('../models/transaction.model.js');
const User = require('../models/user.model.js');
const mongoose = require('mongoose');

exports.createTransaction = async (req, res) => {
  const { senderId, receiverId, amount, remarks, fullName } = req.body;

  if (!senderId || !receiverId || !amount || !remarks || !fullName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await User.findById(senderId).session(session);
    const receiver = await User.findById(receiverId).session(session);

    if (!sender || !receiver) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    if (sender.balance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    const transaction = new Transaction({
      sender: senderId,
      receiver: receiverId,
      amount,
      remarks,
      fullName,
    });

    const savedTransaction = await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(savedTransaction);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};