<?php
$game=array(
    "config"=>array(
        "time"=>array("status"=>"true","time_limits"=>array(5,6,7,8)),
        "life"=>array("status"=>"true","life_limits"=>array(5,6,7,8,10)),
        "guide"=>array("status"=>"true"),
        "levels"=>array(
            array("name"=>"easy","words"=>array("tom","cat","rat","bat","hello")),
            array("name"=>"very easy","words"=>array("hell","go to","asd","welcome","lost"))
        )
    )
);
echo json_encode($game);
