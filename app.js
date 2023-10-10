// jshint esversion: 6
//importing libraries
require('dotenv').config();
const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const userRoute = require("./models/userModel");
const transactionRoute = require("./models/transactionModel");
const bankRoute = require("./models/bankModel")
const mongoose = require('mongoose');
const session = require("express-session");
const cors = require("cors");
const app = express();

const secretKey = crypto.randomBytes(64).toString("hex");
app.use(
    session({
        secret: secretKey, // Replace with a secure secret key
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false},
    })
);
//env
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use(express.json());

const bankList = [
    {
        name: "UnionBank of the Philippines",
        logo: "assets/UnionBank-img.png"
    },
    {
        name: "Banco De Oro",
        logo: "assets/BDO-img.png"
    },
    {
        name: "ChinaBank",
        logo: "assets/ChinaBank-img.png"
    },
    {
        name: "Bank of the Philippine Islands",
        logo: "assets/BPI-img.png"
    },
    {
        name: "GCash",
        logo: "assets/Gcash-img.png"
    }
]

//middleware
function isAuthenticated(req, res, next) {
    if (req.session.userAuthenticated) {
        return next();
    }
    res.redirect("/"); 
}
//routes
app.get("/",function (req,res) {
    res.render("index",{
        title:"SouthMate - Secure Your Child's Future Today"
    });
});

app.get("/about", function(req,res){
    res.render("about", {
        title: "About SouthMate"
    });
});

app.get("/register", function(req,res){
    res.render("register",{
        title: "Register to SouthMate"
    });
});
app.get("/registerForm", function(req,res){
    res.render("registerForm",{
        title: "Register to SouthMate"
    });
});
app.get("/registerBank", isAuthenticated, async (req,res) =>{
    res.render("registerBank", {
        title: "SouthMate - Register Bank",
        bankList: bankList
    })
})
app.get("/cashin", isAuthenticated, async (req,res)=>{
    const user = req.session.user;
    const banks = await bankRoute.find({owner:user._id});
    res.render("cashin",{
        title: "SouthMate - Cash In",
        banks: banks
    });
})
app.get("/sendMoney", isAuthenticated, async(req,res)=>{
    res.render("sendMoney",{
        title: "SouthMate - Send Money"
    })
})
app.get("/cashout", isAuthenticated, async(req,res)=>{
    const user = req.session.user;
    const banks = await bankRoute.find({owner:user._id});
    res.render("cashout",{
        title: "SouthMate - Cash Out",
        banks: banks
    })
})
//login route
app.post("/", async(req,res) => {
    const {email, password} = req.body;
    try {
        const user = await userRoute.findOne({email});
        if(user && user.password === password){
            req.session.user = user;
            req.session.userAuthenticated = true;
            res.redirect("/landing");
        }else{
            res.redirect("/");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
//end of login route
app.get("/landing", isAuthenticated, async (req,res) => { 
    const user = req.session.user;
    const transactions = await transactionRoute.find({ $or:[{sender:user._id},{receiver: user._id}]}).sort({date: -1});
    res.render("landing",{
        title: "Welcome to SouthMate!",
        user: user,
        transactions: transactions
    });
});
//transaction routes
app.post("/cashin", async (req, res) => {
    const params = new URLSearchParams({
      secret: "6LcwmB8oAAAAANcVmFrYW39ec-ZEIDk_1JOUNaDC",
      response: req.body['g-recaptcha-response'],
      remoteip: req.ip,
    });
    try {
      const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body: params,
      });
        const data = await captchaRes.json();
        if (data.success) {
            const { cashinAmount, bankOption } = req.body;
            const filter = { email: req.session.user.email }; 
            const user = await userRoute.findOne(filter);
            if (!user) {
                // Handle the case where the user is not found
                res.json({ captchaSuccess: false, error: "User not found" });
                return;
            }
            const bankUser = await bankRoute.findOne({bankName: bankOption});
            if(!bankUser){
                res.json({captchaSuccess: false, message:"Bank not Found"});
                return;
            }
            if(bankUser.balance < cashinAmount){
                res.json({captchaSuccess: false, message: 'Insufficient funds from bank'});
                return;
            }
            bankUser.balance -= parseFloat(cashinAmount);
            await bankUser.save();
            // Update the user's balance
            user.balance += parseFloat(cashinAmount);
            // Save the updated user document
            const updatedUser = await user.save();
            req.session.user = updatedUser; // Update the session user
            const transaction = new transactionRoute({
                sender: bankUser._id,
                receiver: user._id,
                amount: cashinAmount,
                description: "Cash In",
            });
            await transaction.save();
            res.json({ captchaSuccess: true });
        } else {
            res.json({ captchaSuccess: false });
        }
    } catch (error) {
        console.error(error);
        res.json({ captchaSuccess: false, error: "Server error" });
    }
});
app.post("/cashout", async (req, res) => {

    const params = new URLSearchParams({
      secret: "6LcwmB8oAAAAANcVmFrYW39ec-ZEIDk_1JOUNaDC",
      response: req.body['g-recaptcha-response'],
      remoteip: req.ip,
    });
    try {
      const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body: params,
      });
        const data = await captchaRes.json();
        if (data.success) {
            const { cashoutAmount, bankOption } = req.body;
            const filter = { email: req.session.user.email }; // Assuming you use email as a unique identifier
            // Use findOne with async/await
            const user = await userRoute.findOne(filter);
            if (!user) {
                // Handle the case where the user is not found
                res.json({ captchaSuccess: false, error: "User not found" });
                return;
            }
            if(user.balance < cashoutAmount){
                res.json({captchaSuccess: false, message: 'Insufficient funds from account'});
                return;
            }
            const bankUser = await bankRoute.findOne({bankName: bankOption});
            if(!bankUser){
                res.json({captchaSuccess: false, message:"Bank not Found"});
                return;
            }
            bankUser.balance += parseFloat(cashoutAmount);
            await bankUser.save();
            // Update the user's balance
            user.balance -= parseFloat(cashoutAmount);
            // Save the updated user document
            const updatedUser = await user.save();
            req.session.user = updatedUser; // Update the session user
            const transaction = new transactionRoute({
                sender: user._id,
                receiver: bankUser._id,
                amount: cashoutAmount,
                description: "Cash Out",
            });
            await transaction.save();
            res.json({ captchaSuccess: true });
        } else {
            res.json({ captchaSuccess: false });
        }
    } catch (error) {
        console.error(error);
        res.json({ captchaSuccess: false, error: "Server error" });
    }
});
app.post("/sendMoney", async (req, res) => {
    const params = new URLSearchParams({
      secret: "6LcwmB8oAAAAANcVmFrYW39ec-ZEIDk_1JOUNaDC",
      response: req.body['g-recaptcha-response'],
      remoteip: req.ip,
    });
    try {
      const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body: params,
      });
        const data = await captchaRes.json();
        if (data.success) {
            const { sendAmount, recepient } = req.body;
            const filter = { email: req.session.user.email }; // Assuming you use email as a unique identifier
            // Use findOne with async/await
            const user = await userRoute.findOne(filter);
            if (!user) {
                // Handle the case where the user is not found
                res.json({ captchaSuccess: false, error: "User not found" });
                return;
            }
            const recepientUser = await userRoute.findOne({email: recepient });
            if(!recepientUser){
                res.json({captchaSuccess: false, message:"User not Found"});
                return;
            }
            if(user.balance < sendAmount){
                res.json({captchaSuccess: false, message: 'Insufficient funds to send.'});
                return;
            }
            // Update the user's balance
            user.balance -= parseFloat(sendAmount);
            // Save the updated user document
            const updatedUser = await user.save();
            req.session.user = updatedUser; // Update the session user
            recepientUser.balance += parseFloat(sendAmount);
            await recepientUser.save();
            const transaction = new transactionRoute({
                sender: user._id,
                receiver: recepientUser._id,
                amount: sendAmount,
                description: "Send Money",
            });
            await transaction.save();
            res.json({ captchaSuccess: true });
        } else {
            res.json({ captchaSuccess: false });
        }
    } catch (error) {
        console.error(error);
        res.json({ captchaSuccess: false, error: "Server error" });
    }
});
app.post("/registerBank", async (req, res) => {
    const params = new URLSearchParams({
      secret: "6LcwmB8oAAAAANcVmFrYW39ec-ZEIDk_1JOUNaDC",
      response: req.body['g-recaptcha-response'],
      remoteip: req.ip,
    });
    try {
      const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body: params,
      });
        const data = await captchaRes.json();
        if (data.success) {
            const { accountNumber, bankOption } = req.body;
            const filter = { email: req.session.user.email }; // Assuming you use email as a unique identifier
            // Use findOne with async/await
            const user = await userRoute.findOne(filter);
            let image = "";
            if (!user) {
                // Handle the case where the user is not found
                res.json({ captchaSuccess: false, error: "User not found" });
                return;
            }
            bankList.forEach(bank => {
                if(bank.name === bankOption){
                    image = bank.logo;
                }
            })
            const newBank = new bankRoute({
                owner: user._id,
                accountNumber: accountNumber,
                bankName: bankOption,
                image: image
            })
            await newBank.save();
            res.json({ captchaSuccess: true });
        } else {
            res.json({ captchaSuccess: false });
        }
    } catch (error) {
        console.error(error);
        res.json({ captchaSuccess: false, error: "Server error" });
    }
});
//logout route
app.post("/logout", isAuthenticated, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect("/");
    });
});
//end of logout route
//register route
app.post("/registerForm", async(req,res) => {
    try {
        const newUser = await userRoute.create(req.body);
        const {fname, mname, lname} = req.body;
        let userName = [fname,mname,lname].filter(Boolean).join(' ');
        newUser.name = userName;
        await newUser.save();
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
});
//routes end

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, function(){
        console.log('Server started on port ' + PORT);
    });
  }).catch((error) => {
    console.log(error)
  });