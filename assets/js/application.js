var currentGame = null;
var gameConfig = null;
var application = {};

application.config = {
    setupSartupConfig: function () {
        $.ajax({
            url: "getConfig.php",
            type: "POST",
            async: false,
            data: {}
        }).done(function (data) {
            alert(data);
            gameConfig = jQuery.parseJSON(data);
            alert("Data: " + gameConfig.config.levels[0].words);
            //application.game.shuffleArray(gameConfig.config.levels[0].words); //fruits.slice(1, 3);
            //alert("Data: " + gameConfig.config.levels[0].words);
        }).fail(function () {
            alert("Sorry, Game is currenty down, try after sometime.");
        }).always(function () {
            //$("#snip-add-loading").fadeOut();
        });
    }
};

application.game = {
    createNewGame: function (time_limit,life_limit,guide,level,words_limit) {  
        /* parameter structure
         * time_limit 0 for unlimited
         * life_limit 0 for unlimited
         * guife true/false
         * lavel-> integer index of level
         */
        var all_words=gameConfig.config.levels[0].words;
        application.helper.shuffleArray(all_words);
        var selected_words=all_words.slice(0,words_limit);
        application.game.createWordsArray(selected_words);
        /* currentGame structure
         * "time_limit"  // time limit
            "life" // life limit and life remains
            "guide" // guide is on or off
            "word_limit" // what is limit of words
            "level" // what is level of game i.e. easy
            "words" // array of words
            "current_word_index" // which word is currently slove by user
         */
        currentGame = {
            "time_limit":time_limit,
            "life":{"life_limit":life_limit,"life_remains":life_limit},
            "guide":guide,
            "word_limit":words_limit,
            "level":level,
            "current_word_index":0,
            "words":application.game.createWordsArray(selected_words)
        };
        alert(JSON.stringify(currentGame));
        
    },
    checkCurrentWord: function () {

    },
    passCurrentWord: function () {

    },
    finishGame: function () {

    },
    updateGuide: function () {

    },
    updateLife: function () {

    },
    createWordsArray: function(selected_words){
        var wordJson={words:[]};
        for(var i=0;i<selected_words.length;i++){
            var suff_word=selected_words[i].split(""); //shuffle word
            application.helper.shuffleArray(suff_word);
            wordJson.words.push({
                "word":selected_words[i],
                "status":0,
                "last_status":suff_word
            });
        }
        return wordJson.words;
        /*
         * status 0->not attempted 1->attempted 2->correct
         */
    }
};

application.helper = {
    shuffleArray: function (arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
            var index = Math.floor((Math.random() * 10) + 1);
            while (index > arr.length - 1) {
                index = Math.floor((Math.random() * 10) + 1);
            }
            var a = arr[index];
            arr[index] = arr[i];
            arr[i] = a;
        }
    }
}
application.event = {
    setUpOneTimeEvent: function () {
        application.config.setupSartupConfig();
        application.game.createNewGame(1,1,true,1,4);
    }
};