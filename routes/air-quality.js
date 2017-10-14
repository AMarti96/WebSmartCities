/**
 * Created by Lazarus of Bethany on 14/10/2017.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var Provider = require('./provider');
var path = require('path');
const URL='https://api.thingtia.cloud/data';
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

});
router.get('/sensor/:types', function (req, res) {
    var nodes=[];
    var sensors=[];
    var name;
    Provider.find({types:req.params.types}).exec(function (err, token) {
        for(i=0;i<token.length;i++){
            nodes.push({name:token[i].name,token:token[i].token})

        }

        for (var i=0;i<nodes.length;i++){
            name=nodes[i];
            request({
                uri: URL + "/" + nodes[i].name,
                headers: {"IDENTITY_KEY": nodes[i].token, "Content-Type": "application/json"}
            }, function (error, response, body) {
                body=JSON.parse(body)
                for(i=0;i<body.sensors.length;i++) {
                    sensors.push({provider:name.name,sensor:body.sensors[i].sensor, location:body.sensors[i].observations[0].location,value:body.sensors[i].observations[0].value})

                }
                res.send(sensors);
            })
        }
    })
});


router.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '../public/tpls/', 'error.html'));
});
module.exports = router;