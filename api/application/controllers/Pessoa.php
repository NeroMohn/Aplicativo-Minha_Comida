<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use Restserver\Libraries\REST_Controller;

require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';

class Pessoa extends REST_Controller{ 

    public function __contruct(){
        parent::__contruct();
        //$this->load->model('pessoa_model');
    }

    public function index_get(){
        $this->load->model('pessoa_model');

        $pessoas = $this->pessoa_model->buscaPessoas();
        if($pessoas){
            $this->response(array('pessoas'=>$pessoas),200);
        }else{
            $this->response('Error!');
        }     
    }

    public function cadastrarPessoa_post(){
        $this->load->model('pessoa_model');
        
        $pessoa = $this->post('pessoa');

        $res = $this->pessoa_model->addPessoa($pessoa);
        if($res){
            $this->response("Cadastro realizado com sucesso!",200);
        }else{
            $this->response(array('Error ao cadastrar','error:'=>$res));
        }       

    }

    public function updatePessoa_put(){
        $this->load->model('pessoa_model');

        $pessoa = $this->put('pessoa');
        $res = $this->pessoa_model->updatePessoa($pessoa);
        if($res){
            $this->response("Atualização realizada com sucesso!",200);
        }else{
            $this->response('Error ao atualizar');
        }   
        

    }

    public function buscaPessoa_get(){
        $this->load->model('pessoa_model');

        $id = $this->input->get('id');
        $res = $this->pessoa_model->buscaPessoa($id);
        if($res){
            $this->response(array('dados'=>$res),200);
        }else{
            $this->response('Error');
        }
    }

    public function deletePessoa_delete($id){
        $this->load->model('pessoa_model');  
        //$id = $this->input->get('id');
        $res = $this->pessoa_model->deletePessoa($id);
        if($res){
            $this->response("Pessoa deletada com sucesso!",200);
        }else{
            $this->response('Error ao deletar pessoa!');
        }
    }
}