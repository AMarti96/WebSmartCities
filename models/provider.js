/**
 * Created by Lazarus of Bethany on 14/10/2017.
 */
var mongoose = require('mongoose');
var providers = mongoose.Schema({
    name: String,
    token: String,
    type:String
});
var Provider = mongoose.model('providers', providers);
module.exports = Provider;