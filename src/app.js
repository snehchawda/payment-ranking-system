import express from 'express'; 
import logger from './loaders/logger.js';
import routes from './routes/index.js';
import connection from './loaders/database.js'
// import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // body-parsing
app.use('/', routes);   // routes

async function startServer() {
    await connection;
    const server = app.listen(PORT, () => {
        logger.info(`
        ###############################
        Server listening on port: ${PORT} 
        ###############################
        `);
      }).on('error', err => {
        logger.error(err);
        process.exit(1);
      });
}

startServer();