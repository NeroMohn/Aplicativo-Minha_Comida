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
    email= email;
    let pass = req.body.senha;
   
    User.find({email:email}) 
    .then((data)=>{
        let tam =data.length;
        data = data[0]
        console.log(tam>0)
        if(data.pass === pass &&tam>0){
            res.send(JSON.stringify({status:"sucess",  data}));
        }else{
            res.send(JSON.stringify({status:'error', message:'E-mail ou senha errados !'}));
        }
    })
    .catch((err)=>{
        res.send(JSON.stringify({status:'error'}));
    })
 
});

router.get('/', function(req, res, next) {
    let email =req.query.email;
    let pass = req.query.senha;
   
    User.find({email:email})
    .then((data)=>{
        let tam =data.length;
        data = data[0]
        console.log(tam>0)
        if(data.pass === pass &&tam>0){
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
