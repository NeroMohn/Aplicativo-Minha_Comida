<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Evento_Model extends CI_Model{


    public function busca_eventos(){
        $response = $this->db->select()->get('evento')->result_array();
        if($response){
            return $response;
        }else{
            false;
        }
    }

    public function add_evento($evento){
        //https://api.postmon.com.br/v1/cep/36047280
        $response = $this->db->insert('evento',$evento);
        if($response){
            return true;
        }else{false;}
    }

    public function update($id_evento,$evento){
        if(isset($id_evento)){
            $response = $this->db->where('id',$id_evento)->update('evento',$evento);
            return true;
        }else{
            return false;
        }
    }

    public function delete($id_evento){
        if(isset($id_evento)){
            $response = $this->db->where('id',$id_evento)->delete('evento');
            return true;
        }else{
            return false;
        }
    }
}

?>