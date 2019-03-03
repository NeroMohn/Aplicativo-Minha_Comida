const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id:String,
    categoria:String,
    idApp:String,
    img:String,
    ordem:Number
},
{
    collection:'categorias'
});
module.exports = mongoose.model('categorias',userSchema);

