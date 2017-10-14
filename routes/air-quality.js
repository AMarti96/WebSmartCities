/**
 * Created by Lazarus of Bethany on 14/10/2017.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var Provider = require('../models/provider');
//var User =require('../models/users');
//var Event = require('../models/events');
//var AirQuality = require('../models/airquality');
var path = require('path');
var HashMap= require('hashmap')
const URL='https://api.thingtia.cloud/data';

//var Hash = require('jshashes');
/*
 function getMapTypes() {
 var types= new HashMap();
 var i=0;
 var providers=JSON.parse(localStorage.getItem("tokens"))
 for(i;i<providers.length;i++){
 types.set(providers[i].name,providers[i].type)
 }
 return types
 }*/
router.get('/sensor/:provider/:sensor/:number', function (req, res) {

    var provider = req.params.provider;
    var sensor = req.params.sensor;
    var number=req.params.number;
    var URI=URL+'/'+provider+'/'+sensor+"?limit="+number;

    Provider.findOne({name:provider}).exec(function (err,tokens) {
        var token=tokens.token;
        request( {
            uri:URI,
            headers: {"IDENTITY_KEY":token,"Content-Type": "application/json"}
        },function (error,response,body) {
            res.send(body)
        })
    });
    /*var types= getMapTypes()
     var provider_type=types.get(provider)
     var provider_types=JSON.parse(provider_type)
     if(provider_types.indexOf("park_meter")!=undefined){
     //request
     }
     else {
     //error
     }
     */

});
router.get('/sensor/:provider', function (req, res) {


    var provider = req.params.provider;
    var URI=URL+'/'+provider;
    Provider.findOne({name:provider}).exec(function (err,tokens) {
        var token=tokens.token;
        request( {
            uri:URI,
            headers: {"IDENTITY_KEY":token,"Content-Type": "application/json"}
        },function (error,response,body) {
            res.send(body)
        })
    });
});


router.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '../public/tpls', 'error.html'));
});
module.exports = router;