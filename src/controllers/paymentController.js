// const constants = require('../constants/constants.js');
// const Payment = require('../models/paymentModel.js');
// const User = require('../models/userModel.js');
import constants from '../constants/constants.js';
import Payment from '../models/paymentModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

const recordPayment = async (req, res) => {
    const { userId, amount } = req.body;

    // Validate the amount against predefined values
    const validAmounts = constants.defaultAmounts.map(item => item.value);
    if (!validAmounts.includes(amount)) {
        return res.status(400).json({ error: 'Invalid payment amount' });
    }
    try {
        // Create a new payment using the Payment model
        const payment = new Payment({ user: userId, amount });

        // Save the payment to the database
        await payment.save();

        // Update the user's balance and transactions
        await User.findOneAndUpdate(
            { _id: userId },
            { $inc: { balance: amount }, $push: { transactions: { amount, timestamp: new Date() } } },
            { new: true }
        );

        // Recalculate user ranks based on total payment amounts
        await updateRanks();

        res.status(200).json({ message: 'Payment recorded successfully', userId, amount });
    } catch (error) {
        console.error('Error recording payment:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateRanks = async () => {
    try {
        const users = await User.find().sort({ balance: -1 });

        users.forEach(async (user, index) => {
            // Update user ranks based on index (index + 1 to start from 1)
            await User.updateOne({ _id: user._id }, { $set: { rank: index + 1 } });
        });
    } catch (error) {
        console.error('Error updating user ranks:', error.message);
    }
}; 

const getRank = async (req, res) => {
    try {
        console.log("IN GET RANK",req.query)
        const { userId } = req.query;
        // var collection = db.collection("users");
        var query = {
            "_id": new mongoose.Types.ObjectId("65bdc866e6559a6bb62f2381")
        };

        // Check if userId is missing
        if (!userId) {
            return res.status(400).json({ error: 'User id not found in request.' });
        }

        // Fetch the user's balance and rank
        const user = await User.findOne(query, 'balance rank');
        
        // const user = await User.findById(query);
        console.log("USER", user)

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        res.status(200).json({ amount: user.balance, rank: user.rank });
    } catch (error) {
        console.error('Error fetching user rank:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const predictFutureRanks = async (req, res) => {
    const { userId } = req.query;

    try {
        // Fetch the user's balance and rank
        const user = await User.findOne({ _id: userId }, 'balance rank');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create an array to store predicted ranks for each predefined payment amount
        const predictions = await Promise.all(
            constants.defaultAmounts.map(async ({ value: amount }) => {
                // Calculate future rank based on the assumed payment
                const futureBalance = user.balance + amount;
                const futureRanks = await User.find({ balance: { $gt: futureBalance } }).count();

                return { amount, rank: futureRanks + 1 };
            })
        );

        res.status(200).json(predictions);
    } catch (error) {
        console.error('Error predicting future ranks:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { recordPayment, getRank, predictFutureRanks };
