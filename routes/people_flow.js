var express = require('express');
var router = express.Router();
var request = require('request');
const URL="https://api.thingtia.cloud/data";
var Provider =require('../models/provider');


router.get('/sensor/:provider', function (req, res) {
    Provider.findOne({name: req.params.provider}).exec(function (err, token) {
        request({
            uri: URL + "/" + token.name,
            headers: {"IDENTITY_KEY": token.token, "Content-Type": "application/json"}
        }, function (error, response, body) {
            res.send(body);
        })
    })
});
router.get('/sensor/:provider/:sensor/:number', function (req, res) {
    Provider.findOne({name: req.params.provider}).exec(function (err, token) {
        request({
            uri: URL +"/" + token.name+"?limit="+req.params.number,
            headers: {"IDENTITY_KEY": token.token, "Content-Type": "application/json"}
        }, function (error, response, body) {
            res.send(body);
        })
    })
});

router.get('/landmark', function (req, res) {
    Provider.find({type:"pepople"}).exec(function (err, token) {
        request({
            uri: URL +"/" + token.name+"?limit="+req.params.number,
            headers: {"IDENTITY_KEY": token.token, "Content-Type": "application/json"}
        }, function (error, response, body) {
            res.send(body);
        })
    })
});

router.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '../public/tpls', 'error.html'));
});

module.exports = router;