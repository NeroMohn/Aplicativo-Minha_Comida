var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./../schema/users');

mongoose.connect('mongodb://localhost/minha_comida').then(
  ()=>{},
  err =>{console.log("Erro na conexão com o banco de dados !",err);}
);

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({email:req.query.email, idApp:req.query.idApp})
  .then((data)=>{
    res.send(data);
  })
  .catch((err)=>{
    res.send(JSON.stringify({status:'error'}));
  })

});

module.exports = router;
