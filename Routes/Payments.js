const express = require('express');
const router = express.Router()
const fetchuser = require('../Middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const PaymentHistory = require('../models/PaymentHistory');

router.get('/fetchpaymenthistory', async (req, res) => {
    try {
        const Payment_History = await PaymentHistory.find({ user: req.user.id });
        res.status(200).json(Payment_History);
    } catch (error) {
        res.status(500).json({ 'error': 'some error occured' });
        
    }
});
// Route to Update Payment Transcation Schema in MongoDB



module.exports = router;