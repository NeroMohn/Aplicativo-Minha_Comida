<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class OAuth_model extends CI_Model{
   
   
    public function login($email,$usuario,$senha){
        if(!isset($email) && !isset($usuario) && !isset($senha)){return false;}

       $this->db->select()->where('email',$email);
       if(isset($usuario)){
         $this->db->or_where('username',$usuario);
       }
       $user = $this->db->get('users')->result_array();
       $user = $user[0];
        if(isset($user)){
            if($user['password'] == $senha){

                $pessoa = $this->db->select('id,nome,sobrenome')->where('id_users',$user['id'])->get('pessoa')->result_array();
                $pessoa = $pessoa[0];
                //salvando sessão
                if(!isset($_SESSION)) session_start();

                 //salvando dados na sessão
                $_SESSION['id'] = $user['id'];
                $_SESSION['nome'] = $pessoa['nome'];
                $_SESSION['sobrenome'] = $pessoa['sobrenome'];

                return true;

            }else{
                return 'SENHA INCORRETA!';
            }
            
        }else{
            return 'USUARIO NÃO ENCONTRADO!';
        }
    }

    public function verificaLogado($id){
        if(!isset($_SESSION)) session_start();

        if(!isset($_SESSION['id']) || $_SESSION['id'] != $id){
            session_destroy();
            return 'USUARIO NÃO LOGADO';
        }
    }

    public function logout(){
       session_start(); 
       session_destroy();
       return true;
    }
}

?>