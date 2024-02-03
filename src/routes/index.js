// const express = require('express');
// const { recordPayment, getRank, predictFutureRanks } = require('../controllers/paymentController');
// const router = express.Router();
import express from 'express';
import { recordPayment, getRank, predictFutureRanks } from '../controllers/paymentController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello, this is your Express server with MongoDB!');
});

// Endpoint to record payments
router.post('/payments', recordPayment);

// Endpoint to fetch the current rank based on the user's payment amount
router.get('/rank', getRank);

// Endpoint to predict future ranks
router.get('/future-ranks', predictFutureRanks);

export default router;
