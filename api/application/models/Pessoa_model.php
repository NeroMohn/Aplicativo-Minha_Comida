<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Pessoa_model extends CI_Model{

    public function buscaPessoas(){
        $res =  $this->db->select('nome,sobrenome')->get('pessoa')->result_array();

        if($res){
            return $res;
        }else{
            return false;
        }
    }

    public function buscaPessoa($id){
        if(!isset($id))  {return false;};

        $res =  $this->db->select()->where('id',$id)->get('pessoa')->result_array();

        if($res){
            return $res;
        }else{
            return false;
        }
    }

    public function addPessoa($dados){
        if(!isset($dados))  {return $dados;}

        $res = $this->db->insert('pessoa',$dados);
        if($res){
            return true;
        }else{
            return $res;
        }
    }

    public function updatePessoa($dados){
        if(!isset($dados)) {return false;}
        if(!isset($dados['id']))  {return false;}

        $res = $this->db->where('id',$dados['id'])->update('pessoa',$dados);
        if($res){
            return true;
        }else{
            return false;
        }
    }

    public function deletePessoa($id){
        if(!isset($id)){return false;}

        $res = $this->db->where('id',$id)->delete('pessoa');
        
        if($res){
            return true;
        }else{
            return false;
        }
    }

}