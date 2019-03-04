const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    _id:Schema.Types.ObjectId,
    nome:String,
    score:Number,
    img:String,
    idApp:String,
    categoria:String,
    descricao:String,
    valor:Number
},
{
    collection:'cardapio'
});
module.exports = mongoose.model('cardapio',userSchema);

