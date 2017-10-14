/**
 * Created by Lazarus of Bethany on 05/05/2017.
 */
var Schema = require('node-schema-object');
var Parking = new Schema({
    observations: [{
        value:String,
        timestamp:String,
        location:String
    }]
});
module.exports = Parking;