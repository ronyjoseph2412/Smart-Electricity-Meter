const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;
const PaymentsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    user_address: {
        type: String,
        required: true
    },
    current_wallet_balance: {
        type: Number,
        default: 0
    },
    payment_pending_amount: {
        type: String,
        default: "0",
    },
    payment_history: {
        type: Array,
        default: []
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },

})

module.exports = mongoose.model('payment_history', PaymentsSchema);
//   module.exports = payment_history;
