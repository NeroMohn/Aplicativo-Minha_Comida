const mongoose = require('mongoose');
var Timestamp = require('mongodb').Timestamp;

const userSchema = mongoose.Schema({
    _id:String,
    id_usuario:String,
    pedidos:Array,
    data:String,
    status:Number,
    idApp:String,
},
{
    collection:'pedidos'
});
module.exports = mongoose.model('pedidos',userSchema);

