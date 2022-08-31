const express = require('express');
const router = express.Router()
const User = require('../Models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../Middleware/fetchuser');
const fetch = require("node-fetch");
const PaymentHistory = require('../models/PaymentHistory');
const Units = require('../models/Units');



const JWT_SECRET = 'SMARTRIC_017';
router.post('/registeruser',[body('email', 'Enter a valid Email').isEmail(), body('phonenumber', 'Phone number is not valid').isLength({ min: 10 }),body('meterid', 'Enter a correct Meter ID').isLength({ min: 4 })], async (req, res) => {
    console.log(JWT_SECRET);
    
    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return (res.status(400).json({ "error": "User already exists! Please enter a valid email-address." }))
        }
        
        

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            user_address: req.body.user_address,
            phonenumber: req.body.phonenumber,
            meterid: req.body.meterid,
        })

        const paymentschema = new PaymentHistory({
            user: user.id,
            meterid: req.body.meterid,
            user_address: req.body.user_address,
        });
        const response = await paymentschema.save();
        console.log(paymentschema);
        console.log(response);
        const unitsSchema = new Units({
            user: user.id,
            user_address: req.body.user_address,
            previous_reading: 0,
            units_consumed: 0,
            previous_month_bill_status: false,
        });
        const response1 = await unitsSchema.save();
        console.log(unitsSchema);
        console.log(response1);
        const data = {
            user: {
                id: user.id
            }
        }
        res.json({ "message": "User registered successfully", "data": data });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ 'error': 'some error occured' });
    }
    
});

router.post('/login', [body('email', 'Enter a valid Email').isEmail(), body('password', 'Password cannot be blank').exists()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ "error": "Please try again or create an account using the Sign-Up Portal!" })
        }
        const passwordComapare = await bcrypt.compare(password, user.password);
        if (!passwordComapare) {
            return res.status(400).json({ "error": "Please try again or create an account using the Sign-Up Portal!" })
        }
        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        
        res.json({ "authToken": authToken });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ 'error': 'Internal error occured' });
    }

});

router.get('/getuser', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");;
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ 'error': 'some error occured' });
    }
});

module.exports = router;
