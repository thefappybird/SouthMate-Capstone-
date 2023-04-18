// jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


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
app.listen(3000, function(){
    console.log("Server started on port 3000");
});