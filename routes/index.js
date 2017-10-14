var express = require('express');
var bodyParser = require( 'body-parser' );
var app = express();
app.use( bodyParser.urlencoded({ extended: true }) );
var mongoose = require('mongoose');
var multer = require('multer');
var cors = require('cors');
var request = require('request');
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

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function putTimer() {

    var rnd=getRndInteger(1,3)
    var location
    if(rnd==1){
        location="41.3925 2.1450999999999567"
    }else if(rnd==2){
        location="41.3913 2.1801000000000386"
    }
    else if(rnd==3){
        location="41.3888 2.158990000000017"
    }
// Set the headers
    var headers = {
        'Content-Type': 'application/json',
        'IDENTITY_KEY': "f37a27ae85763ebe4276455d873ec12d206a96ae1c818f2717376a3cd3165e7a"
    }

// Configure the request
    var options = {
        url: 'https://api.thingtia.cloud/data/6772696769746f/CO2_Meter'+rnd,
        method: 'PUT',
        headers: headers,
        body:JSON.stringify({"observations":[{"value":getRndInteger(350,5000), "location": location }]})
    }

// Start the request
    request(options, function (error, response, body) {
            // Print out the response body
            console.log(rnd+"  "+location)

    })
}

app.listen(3500, function () {


     setInterval(putTimer, 3000);
    console.log('App listening on port 3500!!')
});