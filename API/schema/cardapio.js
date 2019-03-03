const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id:String,
    nome:String,
    score:Number,
    img:String,
    idApp:String,
    categoria:String,
    descricao:String
},
{
    collection:'cardapio'
});
module.exports = mongoose.model('cardapio',userSchema);

