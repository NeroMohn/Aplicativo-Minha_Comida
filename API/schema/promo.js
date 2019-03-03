const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id:String,
    titulo:String,
    idApp:String,
    descricao:String,
    img:String,
    ordem:Number
},
{
    collection:'promo'
});
module.exports = mongoose.model('promo',userSchema);

