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

    public function pegaEndereco($cep){
        $res = $this->db->select('cep')->where('cep',$cep)->get('endereco');
        if($res->num_rows()>0){
            return true;
        }else{
            $url_api = 'https://api.postmon.com.br/v1/cep/'.$cep;
            $ch = curl_init();
    
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_URL, $url_api);
    
            $endereco = curl_exec($ch);

            curl_close($ch);
            $endereco = json_decode($endereco, true);

            if($endereco){
                $this->db->set('cep',$endereco['cep'])->set('estado',$endereco['estado'])->set('cidade',$endereco['cidade']);
                $this->db->set('bairro',$endereco['bairro'])->set('logradouro',$endereco['logradouro'])->set('area_km2_estado',$endereco['estado_info']['area_km2']);
                $this->db->set('cd_ibge_estado',$endereco['estado_info']['codigo_ibge']);
                $this->db->set('area_km2_cidade',$endereco['cidade_info']['area_km2'])->set('cd_ibge_cidade',$endereco['cidade_info']['codigo_ibge']);
                $res = $this->db->insert('endereco');
                if($res){
                    return true;
                }else{
                    return false;
                }
            }else{return "Endereço não encontrado";}
        }
    }

    public function filtraEventos($filtro){
        $condicao = "WHERE titulo LIKE '%".$filtro."%' || tipo LIKE '%".$filtro."%'";
        $response = $this->db->query("SELECT * FROM evento ".$condicao)->result_array();

        if($response){
            return $response;
        }else{
            return false;
        }
    }
}

?>