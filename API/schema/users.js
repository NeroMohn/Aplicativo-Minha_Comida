const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id:String,
    email:String,
    pass:String,
    idApp:String,
    nome:String,
    enderco:Array,
    isAdmin:Number
},
{
    collection:'user'
});
module.exports = mongoose.model('user',userSchema);

