var express = require('express');
var bodyParser = require( 'body-parser' );
var app = express();
var cors = require('cors');
var air=require('./airquality_model');
var parking=require('./parking_model');
var people=require('./people_model');
var request=require('request');
var mongoose = require('mongoose');
var server=require('http').createServer(app);
var io=require('socket.io')(server);
var connections=[];

mongoose.connect("mongodb://localhost:27017/providers", function (err) {
    if (!err) {
        console.log("We are connected")
    }
});

var readAirQuality=require("./air-quality");
var readParking = require("./parking_meter");
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
    console.log(req.params.provider);
    console.log(req.body);
    socket.emit('newco2',req.body.observations);
});
var socket=io.on('connection',function (socket) {

})
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function putTimer(sensor) {
    var value=getRndInteger(sensor.min,sensor.max-1);
    var rnd=getRndInteger(0,sensor.variables.length-1);
// Set the headers
    var headers = {
        'Content-Type': 'application/json',
        'IDENTITY_KEY': sensor.token
    }
// Configure the request
    var options = {
        url: 'https://api.thingtia.cloud/data/'+sensor.name+'/'+sensor.variables[rnd].sensor,
        method: 'PUT',
        headers: headers,
        body:JSON.stringify({"observations":[{"value":value, "location": sensor.variables[rnd].location }]})
    }

// Start the request
    request(options, function (error, response, body) {
        // Print out the response body
        //console.log(options);
    })
}

app.listen(80, function () {

    setInterval(function(){ putTimer(air) },10000);
    //setInterval(function(){ putTimer(parking) },10000);
    //setInterval(function(){ putTimer(people) },10000);
    console.log('App listening on port 80!!')
});
server.listen(3500)