// const express = require('express');
// const database = require('./loaders/database');
// const { logger, logHttpRequest } = require('./loaders/logger');
// const routes = require('./routes');
import express from 'express';
import database from './loaders/database.js';
// import { logger, logHttpRequest } from './loaders/logger.js';
import logger from './loaders/logger.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Attach routes to the Express app
app.use('/', routes);

database.once('connected', () => {
    // console.log('Connected to MongoDB');
    logger.info('Connected to MongoDB');

    // Start the server
    app.listen(PORT, () => {
        // console.log(`Server is running on port ${PORT}`);
        logger.info(`Server is running on port ${PORT}`);
    });
});

database.on('error', (error) => {
    // console.error('Error connecting to MongoDB:', error.message);
    logger.error('Error connecting to MongoDB:', error.message);
});