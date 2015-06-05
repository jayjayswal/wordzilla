<?php
$game=array(
    "config"=>array(
        "time"=>array("status"=>"true","time_limits"=>array(5,6,7,8)),
        "life"=>array("status"=>"true"),
        "guide"=>array("status"=>"true"),
        "levels"=>array(
            array("name"=>"very easy","words"=>array("computer","mouse","mobile","phone","card","play","mother","father","brother","sister","money","car","boy","girl","welcome")),
            array("name"=>"easy","words"=>array("tom","cat","rat","bat","hello","tom","cat","rat","bat","hello","tom","cat","rat","bat","hello","tom","cat","rat","bat","hello")),
            array("name"=>"Hard","words"=>array("hell","go to","asd","welcome","lost")),
        )
    )
);
echo json_encode($game);
