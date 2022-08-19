const express = require('express');
const router = express.Router()
var admin = require("firebase-admin");
const fetch = require("node-fetch");
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
var serviceAccount = require("../admin.json");
const User = require('../Models/User');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smartric-98eca-default-rtdb.asia-southeast1.firebasedatabase.app"
});


var db = admin.database();
var userRef = db.ref('/');
router.get('/getalluser', async (req, res) => {

    try {
        const user = await userRef.once('value');
        res.status(200).json(user.val());
    } catch (error) {
        res.status(500).json({ 'error': 'some error occured' });
    }
}
)
router.post('/getuser', async (req, res) => {
    try {
        var user = await userRef.child(req.body.user_address);
        user.once('value', function (snap) {
            const data = snap.val();
        }).then(function (data) {
            console.log(data);
            res.status(200).json(data);
        })
    } catch (error) {
        res.status(500).json({ 'error': 'some error occured' });
    }
})

router.post('/sendalert', async (req, res) => {
    try {
        var user = await userRef.child(req.body.user_address);
        user.once('value', async function (snap) {
            const data = snap.val();
            let user = await User.findOne({ address: req.body.user_address });
            console.log(user);
            if (user) {
                res.status(200).json({ "result": data.meter_reading + " " + user.phonenumber + " " + user.meterid });
            }
        })
    } catch (error) {

    }
}
)

// setInterval(async function() {
//     let users = await User.find();
//     console.log(users);
//   }, 500000)
console.log(process.env.TWILIO_ACCOUNT_SID);
async function sendalert() {
    let users = await User.find();
    console.log(users);
    for (let i = 0; i < users.length; i++) {
        var user = await userRef.child(users[i].user_address);
        user.once('value', async function (snap) {
            const data = snap.val();
            if (user) {
                console.log(data.meter_reading + " " + users[i].phonenumber + " " + users[i].meterid);
                client.messages.create({
                    from: 'whatsapp:+14155238886',
                    body: `Your Meter Reading is ${data.meter_reading} associated with the ${users[i].meterid} `,
                    to: `whatsapp:+91${users[i].phonenumber}`
                  }).then(message => console.log(message.sid)).done();
            }
        }
        )
    }
}
sendalert();


module.exports = router;
