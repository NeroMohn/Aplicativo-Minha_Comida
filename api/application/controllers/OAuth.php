<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use Restserver\Libraries\REST_Controller;

require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';

class OAuth extends REST_Controller{

    public function __contruct(){
        parent::__contruct();
    }

    public function login_post(){
        $this->load->model('oAuth_model');

        $email = $this->post('email');
        $usuario = $this->post('usuario');
        $senha = $this->post('senha');

        $response = $this->oAuth_model->login($email,$usuario,$senha);
        if($response){
            $this->response('Login efetuado com sucesso',200);
        }else{
            $this->response('Error ao tentar logar,parametros nulos!',$response);
        } 

    }

    public function verificaLogado_post($id){
        $this->load->model('oAuth_model');

        $response = $this->oAuth_model->verificaLogado($id);
        if($response){
            $this->response('Usuario Logado',200);
        }else{
            $this->response('Error verificar');
        } 
    }

    public function logout_post(){
        $this->load->model('oAuth_model');

        $response = $this->oAuth_model->logout();
        if($response){
            $this->response('Logout efetuado com sucesso',200);
        }else{
            $this->response('Error ao tentar logar!',$response);
        } 
    }
}