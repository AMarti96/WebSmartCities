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
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371000; // Radius of the earth in m
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

router.get("/nearParking/",function (req,res) {


    var userlat=req.body.lat
    var userlon=req.body.lon
    var sensors= []
    var nodes=[]
    var distances= []

    Provider.find({types:"park_meter"}).exec(function (err,response) {

        for(i=0;i<response.length;i++){

        nodes.push({name:response[i].name,token:response[i].token})

        }

        for(i=0;i<nodes.length;i++){

            var provider = nodes[i].name;
            var URI=URL+'/'+provider;

            request( {
                uri:URI,
                headers: {"IDENTITY_KEY":nodes[i].token,"Content-Type": "application/json"}
            },function (error,response,body) {

                body=JSON.parse(body)
                for(i=0;i<body.sensors.length;i++) {
                    sensors.push({sensor:body.sensors[0].sensor, location:body.sensors[0].observations[0].location})
                }

                for(i=0;i<sensors.length;i++) {
                    var latlon=sensors[i].location.split(" ")
                    var distance = getDistanceFromLatLonInKm(userlat,userlon,latlon[0],latlon[1])
                    distances.push({name:sensors[i].name,distance:distance})
                }
                var sorted = distances.sort(function(a, b) {
                    return (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0)
                });
                res.send(sorted[0])
            })


        }


    });

})

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