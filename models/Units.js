const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;

const UnitsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    user_address: {
        type: String,
        required: true
    },
    previous_reading: {
        type: Number,
        required: true,
        default:0,
    },
    units_consumed: {
        type: Number,
        required: true,
        default:0,
    },
    previous_month_bill_status:{
        type:Boolean,
    }, 
    timestamp: {
        type: Date,
        default: Date.now,
    },

})

module.exports = mongoose.model('units', UnitsSchema);
//   module.exports = payment_history;
