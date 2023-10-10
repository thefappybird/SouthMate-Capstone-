const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    accountNumber:{
        type: Number,
        required: true
    },
    bankName: {
        type: String
    },
    balance: {
        type: Number,
        default: 25000,
    },
    image: {
        type: String,
    },
});

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;