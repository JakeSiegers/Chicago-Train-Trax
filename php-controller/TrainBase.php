<?php

    abstract class TrainBase{
        function utf8_encode_all($data){
            if (is_string($data)){
                return utf8_encode($data);
            }
            if (!is_array($data)){
                return $data;
            }
            $returnData = array();
            foreach($data as $dataKey=>$dataValue){
                $returnData[$dataKey] = $this->utf8_encode_all($dataValue);
            }
            return $returnData;
        }

        function outputJson($output){
            header('Content-Type: application/json');
            $this->output = $output;
            $this->outputJson = json_encode($this->utf8_encode_all($output));
            echo $this->outputJson;
        }

        function outputSuccessDataJson($data){
            $this->outputJson(array('success'=>true,'data'=>$data));
        }
    }

?>