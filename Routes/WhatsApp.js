const express = require('express');
const router = express.Router()
var admin = require("firebase-admin");
const fetch = require("node-fetch");
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
var serviceAccount = require("../admin.json");
const PaymentHistory = require('../models/PaymentHistory');
const Units = require('../models/Units');
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


// Logic for Sending Alerts to the User
const d = new Date();
let day = d.getDate();
// day = 5;
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function check_should_alert() {
    // 5th,7th,10th,11th cut down electricity
    if (day == 5 || day == 7 || day == 10) {
        console.log("Alert about the deadline of previous month bill")
        return true;
    }
    if (day === 11) {
        console.log("Should alert User about the meter reading and alert them and cut down electricity");

        return true;
    }
    else if (day === 30 || day === 31) {
        console.log("Should alert User about the deadline of payment");
        return true;
    }
    else if (day === 1) {
        console.log("Should alert User about the deadline of payment");
        return true;
    }
    else {
        console.log("Should not alert User");
        return false;
    }

}

const unit_price = 8.00;
async function sendalert() {
    let users = await User.find();
    if (check_should_alert()) {
        for (let i = 0; i < users.length; i++) {
            // Fetching User from Firebase
            var user = await userRef.child(users[i].user_address);
            user.once('value', async function (snap) {
                // Extracting Firebase data
                const data = snap.val();
                // console.log(user);
                // console.log(data);
                // Extracting User Units data from Mongodb
                const units = await Units.findOne({ user_address: users[i].user_address });
                console.log((data.meter_reading - units.previous_reading) + " " + users[i].phonenumber + " " + users[i].meterid);
                // Extracting  Payment History data from Mongodb
                let Payment_History = await PaymentHistory.find({ user_address: users[i].user_address });
                Payment_History = Payment_History[0];
                // Update Meter Reading
                const units_consumed = data.meter_reading - units.previous_reading;
                const current_month_bill = (data.meter_reading - units.previous_reading) * unit_price;
                console.log(units.previous_month_bill_status)
                if ((day === 1 || day === 5 || day === 7 || day === 10) && units.previous_month_bill_status === false) {
                    console.log("Payment is not done for previous month");
                    console.log(`Your Electricity Bill for the Month ${month[d.getMonth() - 1]} is unpaid. The total amount due is ${current_month_bill} for the consumption associated with the ${users[i].meterid} and the units consumed are ${units_consumed}.The current wallet balance is ${Payment_History.current_wallet_balance}`);
                    // Send WhatsApp Message to User
                    client.messages.create({
                        body: `Your Electricity Bill for the Month ${month[d.getMonth() - 1]} is unpaid. The total amount due is ${current_month_bill} for the consumption associated with the ${users[i].meterid} and the units consumed are ${units_consumed}.The current wallet balance is ${Payment_History.current_wallet_balance}`,
                        from: 'whatsapp:+14155238886',
                        to: 'whatsapp:+91' + users[i].phonenumber
                    }).then(message => console.log(message.sid)).done();
                }
                if (day === 11 && units.previous_month_bill_status === false) {
                    console.log("Payment is not done for previous month");
                    console.log(`Your Electricity Bill for the Month ${month[d.getMonth() - 1]} is unpaid. The total amount due is ${current_month_bill} for the consumption associated with the ${users[i].meterid} and the units consumed are ${units_consumed}.The current wallet balance is ${Payment_History.current_wallet_balance}.Please note that the total amount includes the previous month bill and partly payment of the current month bill.Your electricity will be cut down today if the payment is not done.`);
                    // Send WhatsApp Message to User
                    // set firebase switch to 0
                    db.ref(`/${users[i].user_address}`).update({
                        switch_state: 0
                    });
                    client.messages.create({
                        body: `Your Electricity Bill for the Month ${month[d.getMonth() - 1]} is unpaid. The total amount due is ${current_month_bill} for the consumption associated with the ${users[i].meterid} and the units consumed are ${units_consumed}.The current wallet balance is ${Payment_History.current_wallet_balance}`,
                        from: 'whatsapp:+14155238886',
                        to: 'whatsapp:+91' + users[i].phonenumber
                    }).then(message => console.log(message.sid)).done();
                }
                if (day === 30 || day === 31) {
                    // Calculation of Bill  


                    // If Wallet Balance is more than required Amount the Wallet amount is used to pay the bill
                    console.log(Payment_History);
                    console.log(Payment_History.current_wallet_balance);
                    if (Payment_History.current_wallet_balance - current_month_bill >= 0) {
                        // Update the current wallet balance in MongoDB
                        PaymentHistory.findByIdAndUpdate(Payment_History._id, { current_wallet_balance: Payment_History.current_wallet_balance - current_month_bill }, function (err, doc) {
                            if (err) {
                                console.log("Something wrong when updating data!");
                            }
                            console.log(doc);
                        });

                        Units.findByIdAndUpdate(units._id, { previous_reading: data.meter_reading, units_consumed: units_consumed, previous_month_bill_status: true }, function (err, doc) {
                            if (err) {
                                console.log("Something wrong when updating data!");
                            }
                            console.log(doc);
                        })
                        console.log(`Your Electricity Bill for the Month ${month[d.getMonth()]} is paid using your Wallet. The total amount paid is ${current_month_bill} for the consumption associated with the ${users[i].meterid} and the units consumed are ${units_consumed}.The current wallet balance is ${Payment_History.current_wallet_balance - current_month_bill}`);
                        // Send Whatsapp Notification to User
                        // client.messages.create({
                        //     from: 'whatsapp:+14155238886',
                        //     body: `Your Electricity Bill for the Month ${month[d.getMonth]} is paid using your Wallet. The total amount paid is ${current_month_bill} for the consumption associated with the meter-id ${users[i].meterid} and the units consumed are ${units_consumed}.The current wallet balance is ${Payment_History.current_wallet_balance - current_month_bill}`,
                        //     to: `whatsapp:+91${users[i].phonenumber}`
                        // }).then(message => console.log(message.sid)).done();
                    }
                    else {
                        console.log("Wallet Balance is less than required Amount");
                        Units.findByIdAndUpdate(units._id, { previous_month_bill_status: false }, function (err, doc) {
                            if (err) {
                                console.log("Something wrong when updating data!");
                            }
                            console.log(doc);
                        })
                        console.log(`Your Electricity Bill for the Month ${month[d.getMonth()]} is unpaid. The total amount due is ${current_month_bill} for the consumption associated with the ${users[i].meterid} and the units consumed are ${units_consumed}.The current wallet balance is ${Payment_History.current_wallet_balance}`);
                    }
                }
                // if (user) {
                //     client.messages.create({
                //         from: 'whatsapp:+14155238886',
                //         body: `Your Meter Reading is ${data.meter_reading} associated with the ${users[i].meterid} `,
                //         to: `whatsapp:+91${users[i].phonenumber}`
                //     }).then(message => console.log(message.sid)).done();
                // }
            }
            )
        }
    }
}







// sendalert();


module.exports = router;
