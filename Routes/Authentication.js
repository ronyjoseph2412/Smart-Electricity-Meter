const express = require('express');
const router = express.Router()
const User = require('../Models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../Middleware/fetchuser');

const JWT_SECRET = 'SMARTRIC_017';
router.post('/registeruser',[body('email', 'Enter a valid Email').isEmail(), body('password', 'Password must be of minimum 5 characters').isLength({ min: 5 }),body('meterid', 'Enter a correct Meter ID').isLength({ min: 4 })], async (req, res) => {
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
        
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            meterid: req.body.meterid,
        })
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
