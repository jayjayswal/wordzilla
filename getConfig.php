<?php
$game=array(
    "config"=>array(
        "time"=>array("status"=>"true","time_limits"=>array(5,6,7,8)),
        "life"=>array("status"=>"true"),
        "guide"=>array("status"=>"true"),
        "levels"=>array(
            array("name"=>"Easy","words"=>
	array("about","cake","card","bear","dance","earth","father","gift","hand","jump","learn","neck","page","snow","table","chair","desk",
	"chalk","snow","bread","spoon","train","young","taste","study","rain","ring","paper","open","lock","jelly","hour","gift","fruit",
	"draw","apple","bird","child","dinner","lunch","grape","orange","banana","jelly","empty","glass","evening","female","friend","zero")),

array("name"=>"Medium","words"=>
	array("practice","intend","concern","commit","approach","establish","consider","engage","sarcasm","straight","property","concept",
	"passage","instance","commission","constant","constitute","render","appeal","campaign","league","entertain","yield","finance",
	"undertake","chamber","liberal","attitude","manifest","resource","persist","attribute","advocate","bestow","provoke","elaborate",
	"warrent","flourish","gravity","conspicuous","seige","exploit","humiliate","dispatch","latitude","ancestor","descendant","device",
	"mobile","objective")),
            
array("name"=>"Hard","words"=>
	array("acknowledge","abscond","adequate","analogus","asylum","bewildered","benevolent","collaborate","conjunction","decipher",
	"dominant","eloquent","environment","framework","heritage","absorbent","kaleidoscope","methodology","phenomenon","transformation",
	"xenophobia","fervert","arbitrary","morbid","fortitude","asunder","prospective","rudiment","ideology","audacious","stupendous",
	"wrangle","patronize","encumber","petulant","callous","impetus","zenith","accentuate","burnish","hermitage","clandestine","pundit",
	"incongruity","postulate","adulation","cameo","oratorio","sublimate","emboss")))
    )
);
echo json_encode($game);
