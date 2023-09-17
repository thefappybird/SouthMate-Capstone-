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
            required: true
        },
        mNumber: {
            type: Number,
            required: true
        }, 
        birthDate: {
            type: Date,
            required: true
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
        password: {
            type: String,
            required: true
        },
        balance:{
            type: Number,
            default: 0
        },
        type:{
            type: String,
            default: "User"
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("Userdata", userSchema);

module.exports = User;