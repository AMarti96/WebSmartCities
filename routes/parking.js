var express = require('express');
var router = express.Router();
var https = require('https');
const URL="https://api.thingtia.cloud/data";

//var User =require('../models/users');
var Parking = require('../models/parking');
var path = require('path');
//var Hash = require('jshashes');


router.get('/location/:', function (req, res) {
    https.get(URL+2)
    var NumOfParking=0;
    res.send(NumOfParking)
});
router.get('/allLocation', function (req, res) {
    var NumOfParking=0;
    res.send(NumOfParking)
});

router.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '../public/tpls', 'error.html'));
});

module.exports = router;