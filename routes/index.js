var express = require('express');
var bodyParser = require( 'body-parser' );
var app = express();
var router = express.Router();
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
var readPeople = require("./people_flow");

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
app.use("/people",readPeople);

app.post("/newInfo",function (req,res) {
    console.log(req.body);
    res.send("OK");
});

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function putTimer(sensor) {
// Set the headers
    var headers = {
        'Content-Type': 'application/json',
        'IDENTITY_KEY': sensor.token
    }

// Configure the request
    var options = {
        url: 'https://api.thingtia.cloud/data/'+sensor.name+'/'+sensor.sensor,
        method: 'PUT',
        headers: headers,
        body:JSON.stringify({"observations":[{"value":sensor.value, "location": sensor.location }]})
    }

// Start the request
    request(options, function (error, response, body) {
        // Print out the response body
        console.log(options);
    })
}

function putTimer1() {

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
        console.log(options);
    })
}
function putTimer2() {
    var rnd=getRndInteger(1,3)
    var location
    if(rnd==1){
        location="41.38581022388023 2.164093270766898"
    }else if(rnd==2){
        location="41.40350561240383 2.174537390274054"
    }
    else if(rnd==3){
        location="41.392759856096234 2.1448724254150875"
    }
            console.log(rnd+"  "+location)

// Set the headers
    var headers = {
        'Content-Type': 'application/json',
        'IDENTITY_KEY': "b09af6daff593bfc2ddc612947e8e1e7baa8db30d0a7da6cda9964de2e183d47"
    }

// Configure the request
    var options = {
        url: 'https://api.thingtia.cloud/data/6d61736d69/Parking_Meter'+rnd,
        method: 'PUT',
        headers: headers,
        body:JSON.stringify({"observations":[{"value":getRndInteger(0,50), "location": location }]})
    }

// Start the request
    request(options, function (error, response, body) {
        // Print out the response body
        //console.log(options);
    })
}
function putTimer3() {

    var rnd=getRndInteger(1,3)
    var location
    if(rnd==1){
        location="41.38581022388023 2.164093270766898"
    }else if(rnd==2){
        location="41.3875762778403 2.1889893992920406"
    }
    else if(rnd==3){
        location="41.36299855663192 2.1650179629796185"
    }

// Set the headers
    var headers = {
        'Content-Type': 'application/json',
        'IDENTITY_KEY': "5888dfc1dda8833ffd14ca34794453772d9fb50140e155f9a5509171592c747a"
    }

// Configure the request
    var options = {
        url: 'https://api.thingtia.cloud/data/706174616461/People_Meter'+rnd,
        method: 'PUT',
        headers: headers,
        body:JSON.stringify({"observations":[{"value":getRndInteger(0,2000), "location": location }]})
    }
        //console.log(options);

// Start the request
    request(options, function (error, response, body) {
        // Print out the response body

    })
}

app.listen(80, function () {

    //setInterval(putTimer1, 2000);
    //setInterval(putTimer2, 60000);
    //setInterval(putTimer3, 60000);
    console.log('App listening on port 3500!!')
});