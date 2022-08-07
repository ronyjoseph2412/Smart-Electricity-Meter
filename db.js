const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://rony:rony%402412@cluster0.jhqry.mongodb.net/Smartric?retryWrites=true&w=majority';
// const mongoURI = 'mongodb://localhost:27017/portfolio?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false';
const connecttodatabase = ()=>{
    const connectionParams={
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
    mongoose.connect(mongoURI,connectionParams)
        .then( () => {
            console.log('Connected to database ')
        })
        .catch( (err) => {
            console.error(`Error connecting to the database. \n${err}`);
        })
}
module.exports = connecttodatabase;
