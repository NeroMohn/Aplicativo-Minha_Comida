var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Promo = require('./../schema/promo');
var Categorias = require('./../schema/categorias');
var Cardapio = require('../schema/cardapio');
var Complementos = require('../schema/complementos');
var Estabelecimento = require('../schema/dados_estabelecimento');

mongoose.connect('mongodb://localhost/minha_comida').then(
  ()=>{},
  err =>{console.log("Erro na conexão com o banco de dados !",err);}
);





router.post('/carrousel', function(req, res, next) {
  let idApp = req.body.idApp;
  console.log(JSON.stringify(req.body.idApp));
  Promo.find({idApp:idApp})
  .then((data)=>{
      if(data.length>0){
          res.send(JSON.stringify({status:"sucess",  data}));
      }else{
          res.send(JSON.stringify({status:'error', message:'Nada encontrado !'}));
      }
  })
  .catch((err)=>{
      res.send(JSON.stringify({status:'error',err}));
})


  
router.post('/categorias', function(req, res, next) {
  let idApp = req.body.idApp;
  console.log(JSON.stringify(req.body.idApp));
  Categorias.find({idApp:idApp})
  .then((data)=>{
      if(data.length>0){
          res.send(JSON.stringify({status:"sucess",  data}));
      }else{
          res.send(JSON.stringify({status:'error', message:'Nada encontrado !'}));
      }
  })
  .catch((err)=>{
      res.send(JSON.stringify({status:'error',err}));
  })
});

router.post('/cardapio', function(req, res, next) {
  let idApp = req.body.idApp;
  console.log(JSON.stringify(req.body.idApp));
  Cardapio.find({idApp:idApp})
  .then((data)=>{
      if(data.length>0){
          res.send(JSON.stringify({status:"sucess",  data}));
      }else{
          res.send(JSON.stringify({status:'error', message:'Nada encontrado !'}));
      }
  })
  .catch((err)=>{
      res.send(JSON.stringify({status:'error',err}));
  })
});

});



router.post('/complemento', function(req, res, next) {
    let idApp = req.body.idApp;
    Complementos.find({idApp:idApp})
    .then((data)=>{
        if(data.length>0){
            res.send(JSON.stringify({status:"sucess",  data}));
        }else{
            res.send(JSON.stringify({status:'error', message:'Nada encontrado !'}));
        }
    })
    .catch((err)=>{
        res.send(JSON.stringify({status:'error',err}));
    })
});



router.post('/estabelecimento', function(req, res, next) {
    let idApp = req.body.idApp;
    console.log(JSON.stringify(req.body.idApp));
    Estabelecimento.find({idApp:idApp})
    .then((data)=>{
        if(data.length>0){
            res.send(JSON.stringify({status:"sucess",  data}));
        }else{
            res.send(JSON.stringify({status:'error', message:'Nada encontrado !'}));
        }
    })
    .catch((err)=>{
        res.send(JSON.stringify({status:'error',err}));
  })

});


  
  

module.exports = router;
