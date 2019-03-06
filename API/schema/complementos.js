const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    _id:Schema.Types.ObjectId,
    nome:String,
    img:String,
    idApp:String,
    descricao:String,
    valor:Number
},
{
    collection:'adicionais'
});
module.exports = mongoose.model('adicionaiss',userSchema);

