// const constants = require('../constants/constants.js');
import constants from '../constants/constants.js';
import Payment from '../models/paymentModel.js';
import User from '../models/userModel.js';
import logger from '../loaders/logger.js';

const recordPayment = async (req, res) => {
    logger.info("Record Payment API called")
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Payload data missing' });
        }

        if(!req.body.userId || !req.body.amount)
            return res.status(400).json({ error: 'Invalid payload' });

        const userId = req.body.userId;
        const amount = req.body.amount; 

        // Validate the amount against predefined values
        const validAmounts = await constants.defaultAmounts.map(item => item.value);
        if (!validAmounts.includes(amount)) {
            return res.status(400).json({ error: 'Invalid payment amount' });
        }

        // Create & Save a new payment using the Payment model
        const payment = new Payment({ userId: userId, amount });
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
        logger.error('Error recording payment:', error.message);
        res.status(500).json({ error: error.message });
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
        logger.error('Error updating user ranks:', error.message);
    }
}; 

const getRank = async (req, res) => {
    logger.info("Get Rank API called")
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User id not found in request.' });
        };
        
        // Fetch the user's balance and rank
        const query = User.where({ _id: userId });
        const user = await query.findOne();

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        res.status(200).json({ amount: user.balance, rank: user.rank });
    } catch (error) {
        logger.error('Error fetching user rank:', error.message);
        res.status(500).json({ error: error.message });
    }
};

const predictFutureRanks = async (req, res) => {
    logger.info("Predict Future Ranks API called")    
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'User id not found in request.' });
        }
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
        logger.error('Error predicting future ranks:', error.message);
        res.status(500).json({ error: error.message });
    }
};

export { recordPayment, getRank, predictFutureRanks };
