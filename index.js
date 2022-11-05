const connecttodb = require('./db')
connecttodb()
const express = require('express');
let cors = require('cors');
const app = express();
const fetch = require('node-fetch');

// var cors = require('cors')
app.use(express.json())
app.use(cors())


app.use('/auth',require('./Routes/Authentication'));
app.use('/payments',require('./Routes/Payments'));
app.use('/whatsapp',require('./Routes/WhatsApp'));

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
// setInterval(function() {
//     console.log('Hey there')
//   }, 1000)


app.listen((process.env.PORT || 5000), () => {
    console.log('Server is running on port 5000');
});