// const winston = require('winston');
import winston from 'winston';

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
});

// Function to log HTTP requests
// const logHttpRequest = (req, res, next) => {
//     logger.info(`${req.method} ${req.url}`);
//     next();
// };

// module.exports = { logger };

export default logger;