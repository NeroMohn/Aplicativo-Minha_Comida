var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var Pedidos = require('./../schema/pedidos');
var Cardapio = require('../schema/cardapio');


mongoose.connect('mongodb://localhost/minha_comida').then(
  ()=>{},
  err =>{console.log("Erro na conexão com o banco de dados !",err);}
);


router.post('/meuspedidos', function(req, res, next) {
    let idApp = req.body.idApp;
    let id_usuario = req.body.id_usuario;
    
    if(id_usuario === undefined || id_usuario === '') {
        res.send(JSON.stringify({status:'error', message:'ID do usuario vazia!'}));
    };


    Pedidos.find({idApp:idApp, id_usuario:id_usuario}).sort({ createdOn : -1})
    .then((data)=>{
        let pedidos =  data[0]['pedidos'];
        var array = [];
    
        pedidos.map(element => {
            Cardapio.find({_id:new Object(element[0])})
            .then(adas=>{
                array.push(adas[0])
            })
        })
        setTimeout(() => {
            res.send(JSON.stringify({pedidos:array, dados:data}));
        }, 200);
     

    })
    .catch((err)=>{
        res.send(JSON.stringify({status:'error',err}));
    })

});


router.post('/pedir', function(req, res, next) {
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



router.post('/efetuarPedido', function(req, res, next) {
    let idApp = req.body.idApp;
    let json = JSON.parse(req.body.json);

    Pedidos.insertMany({
        id_usuario:json.id_usuario,
        pedidos:json.pedido[0].pedido,
        status:1,
        idApp:idApp,
        data:new Date(),
        complementos:json.pedido[0].complementos,
        endereco:json.endereco,
        tipo:json.tipo,
        taxa_entrega:json.taxa_entrega,
    })
    
    .then((data)=>{
      setTimeout(() => {
        res.send(JSON.stringify({status:"sucess",  data:data}));
          
      }, 2000);
    })
    .catch(err=>{
        res.send(JSON.stringify({status:"error",   data:data}));
    }) 
});

module.exports = router;
