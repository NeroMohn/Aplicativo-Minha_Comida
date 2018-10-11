<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use Restserver\Libraries\REST_Controller;

require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';

class Evento extends REST_Controller{

    public function __construct(){
		parent::__construct();
    }
    
    function index_get(){
        //$this->load->model('eventos');
        $res = $this->Evento_Model->busca_eventos();
        if($res){
            return $this->response($res,200);
        }else{
            false;
        }
        
    }

    function buscaEventos_get(){
        //$this->load->model('eventos');
        $res = $this->Evento_Model->busca_eventos();
        if($res){
            return $this->response($res,200);
        }else{
            false;
        }
        
    }

    function filtraEventos_get($filtro = null){
        $this->load->model('evento_model');
        $res = $this->evento_model->filtraEventos($filtro);
        if($res){
            $this->response($res,200);
        }else{
            $this->response('Nenhum evento encontrado',404);
        }
    }

    function addEvento_post(){
        $evento = $this->post();
       // echo json_encode($evento);
       $validaEndereco = null;
        if($evento['cep']){
            $validaEndereco = $this->pegaEndereco($evento['cep']);
        }else{
            return false;
        }
     
        $res = $this->Evento_Model->add_evento($evento);
        if($res){
            return $this->response("Evento Cadastrado com Sucesso!",200);
        }else{
            return $this->response("ERROR!",400);
        }

    }

    function updateEvento_put($id_evento){
        //$id_evento = $this->put('id');
        $evento = $this->put();

        $res = $this->Evento_Model->update($id_evento,$evento);
        if($res){
            return $this->response("Evento atualizado com sucesso!",200);
        }else{
            return $this->response("Não foi possivel atualizar!",400);
        }
    }

    function deleteEvento_delete($id_evento){
        //$id_evento = $this->post('id');
        $res = $this->Evento_Model->delete($id_evento);

        if($res){
            return $this->response("Evento deletado com sucesso!",200);
        }else{
            return $this->response("Não foi possivel deletar evento!",400);
        }
    }

    public function pegaEndereco($cep){
        $res = $this->Evento_Model->pegaEndereco($cep);
        if($res){
            return true;
        }else{
            return $res;
        }

    }
} 

?>