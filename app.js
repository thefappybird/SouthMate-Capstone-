// jshint esversion: 6
//importing libraries
require('dotenv').config();
const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const userRoute = require("./models/userModel");
const mongoose = require('mongoose');
const session = require("express-session");
const app = express();


const secretKey = crypto.randomBytes(64).toString("hex");
app.use(
    session({
        secret: secretKey, // Replace with a secure secret key
        resave: false,
        saveUninitialized: true,
    })
);
//env
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use(express.json());

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
app.get("/landing", isAuthenticated, (req,res) => { 
    const user = req.session.user;
    res.render("landing",{
        title: "Welcome to SouthMate!",
        user: user
    });
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