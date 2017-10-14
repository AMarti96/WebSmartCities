var express = require('express');
var bodyParser = require( 'body-parser' );
var app = express();
app.use( bodyParser.urlencoded({ extended: true }) );
var mongoose = require('mongoose');
var multer = require('multer');
var cors = require('cors');
var Provider = require('../models/provider');
module.exports=app;
var localStorage = require('localStorage');

//var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/providers", function (err) {
    if (!err) {
        console.log("We are connected")
    }
});

var readAirQuality=require("./air-quality");
var readParking = require("./parking");

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

app.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin",  "*");
res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS");
res.header('Access-Control-Allow-Headers', "Content-Type, Authorization, Content-Length, X-Requested-With,X-Custom-Header,Origin");
res.header('Access-Control-Allow-Credentials',"true");
next();
});

app.use("/parking",readParking);
app.use("/air",readAirQuality);


app.listen(3500, function () {

    var tokens=[]
    Provider.find(function(err,provider_tokens){
        for (var i = 0; i < provider_tokens.length; i++) {

            tokens.push({name:provider_tokens[i].name,token:provider_tokens[i].token,type:provider_tokens[i].type})

        }
        localStorage.setItem("tokens",JSON.stringify(tokens))
    });
    console.log('App listening on port 3500!!')
});

