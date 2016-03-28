<?php

    require_once($_SERVER['DOCUMENT_ROOT'].'/inc/php/Libraries/CTA-PHP-Wrapper/CTAWrapper.php');
    require_once('TrainBase.php');

    class TrainTrax extends TrainBase{

        private $cta;

        function __construct(){
            $trainKey = '';
            require('Config.php'); //Sets Train Key variable (Also, keeps the key out of the repo).
            $this->cta = new CTAWrapper(array(
                'trainApiKey' => $trainKey
            ));

        }

        function listAllLines(){
            $alertIds = array();
            foreach(CTAWrapper::$TRAIN_LINES as $alertId => $lineData){
                $alertIds[] = $alertId;
            }

            $results = $this->cta->alertApiCall('routes',array('routeId'=>$alertIds));

            $lines = array();
            foreach($results['RouteInfo'] as $route){
                $routeRow = array(
                    $route['Route'],
                    $route['RouteColorCode'],
                    $route['RouteTextColor'],
                    $route['ServiceId'],
                    $route['RouteURL'],
                    $route['RouteStatus'],
                    $route['RouteStatusColor'],
                    CTAWrapper::$TRAIN_LINES[$route['ServiceId']]['niceName']
                );

                //if($route['RouteStatus'] !== 'Normal Service'){
                //    $routeRow[] = $this->cta->alertApiCall('alerts',array('routeid'=>$route['ServiceId']));
                //}

                $lines[] = $routeRow;
            }

            $this->outputSuccessDataJson($lines);
        }

        function getStationsOfLine(){

            if(!isset($_POST['lineId'])) {
                throw new Exception('lineId required!');
            }

            $lineId = $_POST['lineId'];

            if(!isset(CTAWrapper::$TRAIN_LINES[$lineId])){
                throw new Exception('line not found');
            }

            $stops = $this->cta->trainStopsApiCall(array(CTAWrapper::$TRAIN_LINES[$lineId]['trainStopsId']=>true));
            $mapIds = array();
            $outData = array();
            foreach($stops as $stop){
                $outData[] = array(
                    $stop['direction_id'],
                    $stop['location'],
                    $stop['map_id'],
                    $stop['station_descriptive_name'],
                    $stop['station_name'],
                    $stop['stop_id'],
                    $stop['stop_name']
                );

                $mapIds[$stop['stop_id']] = $stop['stop_id'];
            }


            $idGroups = array_chunk(array_values($mapIds),4);
            foreach($idGroups as $group){
                $results = $this->cta->trainApiCall('arrivals',array('stpid'=>$group));
                echo '<pre style="border:solid green 4px;">';
                var_dump($results);
                echo '</pre>';
            }


            $this->outputSuccessDataJson($outData);
        }
    }

?>