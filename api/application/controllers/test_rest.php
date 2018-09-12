<?php
use Restserver\Libraries\REST_Controller;
defined('BASEPATH') OR exit('No direct script access allowed');
 
// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH . '/libraries/REST_Controller.php';
 
class Test_rest extends REST_Controller {
 
    function __construct(){
        parent::__construct();
    }

    public function test_get(){
        echo json_encode("TESTANDO API");
    }
 
}