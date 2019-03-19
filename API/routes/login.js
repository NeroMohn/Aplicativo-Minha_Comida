var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('./../schema/users');

mongoose.connect('mongodb://localhost/minha_comida').then(
  ()=>{},
  err =>{console.log("Erro na conexão com o banco de dados !",err);}
);


router.post('/', function(req, res, next) {
    let email =req.body.email;
    email= email.toLowerCase();
    let pass = req.body.senha;
    console.log(email)
    User.find({email:email})
    .then((data)=>{
        if(data.pass === pass && data.length>0){
            res.send(JSON.stringify({status:"sucess",  data}));
        }else{
            res.send(JSON.stringify({status:'error', message:'E-mail ou senha errados !'}));
        }
    })
    .catch((err)=>{
        res.send(JSON.stringify({status:'error'}));
    })

});


module.exports = router;
