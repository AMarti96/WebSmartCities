var express = require('express');
var router = express.Router();
var request = require('request');
const URL="https://api.thingtia.cloud/data";
//var User =require('../models/users');
var path = require('path');
//var Hash = require('jshashes');


router.get('/:provider', function (req, res) {
    Provider.findOne({name: req.params.provider}).exec(function (err, token) {
        console.log(token);
        request({
            uri: URL + "/" + token.name,
            headers: {"IDENTITY_KEY": token.token, "Content-Type": "application/json"}
        }, function (error, response, body) {
            console.log(body);
            res.send(body);
        })
    })
});
router.get('/:provider/:sensor/:number', function (req, res) {
    Provider.findOne({name: req.params.provider}).exec(function (err, token) {
        console.log(token);
        request({
            uri: URL + "/" + token.name+"?limit="+req.params.number,
            headers: {"IDENTITY_KEY": token.token, "Content-Type": "application/json"}
        }, function (error, response, body) {
            console.log(body);
            res.send(body);
        })
    })
});
module.exports = router;