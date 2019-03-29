const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    _id:Schema.Types.ObjectId,
    nome:String,
    previsao_ini:Number,
    previsao_fin:Number,
    taxa_entrega:Number,
    idApp:String,
},{
    collection:'dados_estabelecimento'
});
module.exports = mongoose.model('dados_estabelecimento',userSchema);

