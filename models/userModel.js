const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            default: 'userName',
            required: true
        },
        gender: {
            type: String,
        },
        mNumber: {
            type: Number,
            required: true
        }, 
        birthDate: {
            type: String,
            required: true,
        },
        placeOfBirth: {
            type: String,
            required: true
        },
        citizenship: {
            type: String,
            required: true
        },
        houseAddress: {
            type: String,
            required: true
        },
        province: {
            type: String,
            required: true
        },
        cityMuni: {
            type: String,
            required: true
        },
        zipCode: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        guardianEmail: {
            type: String
        },
        password: {
            type: String,
            required: true
        },
        idNumber: {
            type: Number,
            required: true,
        },
        balance:{
            type: Number,
            default: 0
        },
        verified: {
            type: Boolean,
            default: false
        },
        type: {
            type: String
        },
        verificationToken: String,
    },
    {
        timestamps: true
    },
    
)

const User = mongoose.model("User", userSchema);

module.exports = User;