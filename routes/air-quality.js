/**
 * Created by Lazarus of Bethany on 14/10/2017.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var HashMap = require('hashmap');
var localStorage = require('localStorage');
//var User =require('../models/users');
//var Event = require('../models/events');
//var AirQuality = require('../models/airquality');
var path = require('path');
const URL='https://api.thingtia.cloud/data';

//var Hash = require('jshashes');
function getMapTokens() {

    var tokens =new HashMap();
    var i=0
    var provider_tokens=JSON.parse(localStorage.getItem("tokens"))
    for(i;i<provider_tokens.length;i++){
        tokens.set(provider_tokens[i].name,provider_tokens[i].token)
    }
    return tokens
}
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
router.get('/:provider/:sensor', function (req, res) {

    var tokens= getMapTokens();
    var provider = req.params.provider;
    var sensor = req.params.sensor;
    var URI=URL+'/'+provider+'/'+sensor;

    /*var types= getMapTypes()
     var provider_type=types.get(provider)
     var provider_types=JSON.parse(provider_type)

     if(provider_types.indexOf("air_quality_co2")!=undefined){

     //request

     }
     else {

     //error

     }
     */


    request( {
        uri: URI,
        headers: {'Content-Type': 'application/json','IDENTITY_KEY':tokens.get(provider)},
    },function (error,response,body) {
        res.send(body)
    })

});
router.get('/:provider', function (req, res) {

    var tokens= getMapTokens()
    var provider = req.params.provider;
    var URI=URL+'/'+provider
    request( {
        uri: URI,
        headers: {'Content-Type': 'application/json','IDENTITY_KEY':tokens.get(provider)},
    },function (error,response,body) {
        res.send(body)
    })
});


router.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '../public/tpls', 'error.html'));
});
module.exports = router;