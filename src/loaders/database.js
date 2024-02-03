// const mongoose = require('mongoose');
// const config = require('../config/config');

// import mongoose from 'mongoose';
// import config from '../config/config.js';

// mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('Connected to MongoDB');
//     })
//     .catch((error) => {
//         console.error('Error connecting to MongoDB:', error.message);
//     });

// module.exports = mongoose.connection;

import mongoose from 'mongoose';
import config from '../config/config.js';

const connection = await mongoose.createConnection(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

try {
    await connection;
    console.log('Connected to MongoDB');
} catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
}

export default connection;