const connecttodb = require('./db')
connecttodb()
const express = require('express');
let cors = require('cors');
const app = express();

// var cors = require('cors')
app.use(express.json())
app.use(cors())


app.use('/auth',require('./Routes/Authentication'));

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.listen((process.env.PORT || 5000), () => {
    console.log('Server is running on port 5000');
});