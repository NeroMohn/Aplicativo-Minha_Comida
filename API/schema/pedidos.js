const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id:String,
    id_usuario:String,
    pedidos:Array,
    data:Date,
    status:Number
},
{
    collection:'pedidos'
});
module.exports = mongoose.model('pedidos',userSchema);

