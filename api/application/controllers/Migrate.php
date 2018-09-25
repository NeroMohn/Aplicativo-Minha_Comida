<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migrate extends CI_Controller {

    
    /*Método construtor*/
  
    public function __construct() {
        parent::__construct();
    }

    public function index() {
        $this->load->library('migration');

        if ($this->migration->current()) {
            echo "Migração bem sucedida!";
        }
        else {
            echo $this->migration->error_string();
        }
    }
}