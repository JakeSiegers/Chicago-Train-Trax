<?php

new TrainRouter();

class TrainRouter{
    private function show404($message){
        header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
        echo '404';
        exit;
    }

    function __construct(){
        if(FALSE === $lastSlash = strrpos($_SERVER['REQUEST_URI'],'/')){
            $this->show404("no slashes to route!");
        }


        if(FALSE !== $queryPos = strrpos($_SERVER['REQUEST_URI'],'?')){
            $routeMethod = substr($_SERVER['REQUEST_URI'], $lastSlash+1, $queryPos-$lastSlash-1);
        }else{
            $routeMethod = substr($_SERVER['REQUEST_URI'], $lastSlash+1);
        }


        $classFile = $_SERVER['DOCUMENT_ROOT'] . '/php/TrainTrax.php';
        if(FALSE === file_exists($classFile)){
            $this->show404("Class file does not exist!");
        }

        require($classFile);
        if(FALSE === class_exists('TrainTrax')){
            $this->show404("Class does not exist!");
        }
        $ClassInstance = new TrainTrax;
        if( FALSE === method_exists($ClassInstance, $routeMethod ) ){
            $this->show404("Method does not exist!");
        }

        $ClassInstance->$routeMethod();
    }
}





