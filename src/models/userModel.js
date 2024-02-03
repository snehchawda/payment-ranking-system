// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    transactions: [
        {
            amount: {
                type: Number,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    rank: {
        type: Number,
        default: 0,
    },
});

const User = mongoose.model('User', userSchema);

export default User;
