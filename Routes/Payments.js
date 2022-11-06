const express = require('express');
const router = express.Router()
const fetchuser = require('../Middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const PaymentHistory = require('../models/PaymentHistory');
const Units = require('../models/Units');

router.get('/fetchpaymenthistory', async (req, res) => {
    try {
        const Payment_History = await PaymentHistory.find({ user: req.user.id });
        res.status(200).json(Payment_History);
    } catch (error) {
        res.status(500).json({ 'error': 'some error occured' });

    }
});
// Route to get payments of all users
router.get('/fetchallpayments', async (req, res) => {
    try {
        const Payment_History = await Units.find();
        let data = []
        for (let i = 0; i < Payment_History.length; i++) {
            const element = Payment_History[i];
            let obj =
            {
                'wallet_address': Payment_History[i].user_address,
                'units_consumed': Payment_History[i].units_consumed,
            }
            data.push(obj)
            // console.log(element.user_address);

        }
        res.status(200).json({'data':data});
    } catch (error) {
        res.status(500).json({ 'error': 'some error occured' });
    }
});
// Route to Update Payment Transcation Schema in MongoDB



module.exports = router;