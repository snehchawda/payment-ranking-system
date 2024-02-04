import mongoose from 'mongoose';
import config from '../config/config.js';

let connection;

const connectToDatabase = async () => {
    try {
        connection = await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw error;
    }
};

export default connectToDatabase();

// export default connection;