var express = require('express');
var router = express.Router();
var request = require('request');
var http=require('http')
const URL="https://api.thingtia.cloud/data";
//var User =require('../models/users');
var path = require('path');
//var Hash = require('jshashes');


router.get('/location/:location', function (req, res) {
    Provider.find("").exec(function (err,tokens) {
        var token=tokens[0];
        console.log(token);
        request( {
            uri: URL+"/"+token.name+"/Parking_Meter1",
            headers: {"IDENTITY_KEY":token.token,"Content-Type": "application/json"}
        },function (error,response,body) {
            console.log(URL+"/"+tokens[0].name+"/Parking_Meter1")
            console.log();
            res.send(body)
        })
    })

});
router.get('/allLocation', function (req, res) {
    var NumOfParking=0;
    res.send(NumOfParking)
});

router.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '../public/tpls', 'error.html'));
});

module.exports = router;