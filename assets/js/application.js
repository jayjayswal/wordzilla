var currentGame = null;
var gameConfig = null;
var application = {};
var scoreunit = 10;
var livesunit = 3;
TotalSeconds = 0;
var gamefinished=false;
application.config = {
    setupSartupConfig: function () {
        $.ajax({
            url: "getConfig.php",
            type: "POST",
            async: false,
            data: {}
        }).done(function (data) {
            // alert(data);
            gameConfig = jQuery.parseJSON(data);
            //alert("Data: " + gameConfig.config.levels[0].words);
            //application.game.shuffleArray(gameConfig.config.levels[0].words); //fruits.slice(1, 3);
            //alert("Data: " + gameConfig.config.levels[0].words);
        }).fail(function () {

        }).always(function () {
            //$("#snip-add-loading").fadeOut();
        });
    }
};

application.game = {
    setUpGuiStartPage: function () {
        var datastatus = application.config.setupSartupConfig();
        if (gameConfig !== null) {
            /******************* Set Levels ********************/
            var levels = gameConfig["config"]["levels"];
            //$("#levelList").empty();
            application.gui.addLevelAtStartPage(levels);

            /******************* Time Limit ********************/
            var timeLimits = gameConfig["config"]["time"]["time_limits"];
            $("#timelimit").empty();
            application.gui.addTimeLimitAtStartPage(timeLimits);
            //$("#levelList").empty();

            /******************* Word Limit ********************/
            var WordLimits = gameConfig["config"]["levels"][0]["words"].length;
            $("#noofword").empty();
            application.gui.addWordLimitAtStartPage(WordLimits);

            /******************* life ********************/
            if (gameConfig["config"]["life"]["status"] === "false") {
                $("#lifes").slider('disable');
            }

            /******************* guide ********************/
            if (gameConfig["config"]["guide"]["status"] === "false") {
                $("#guide").slider('disable');
            }
            return true;
        } else {
            alert("Sorry, Game is currenty down, try after sometime.");
            return false;
        }

    },
    createNewGame: function (time_limit, life_limit, guide, level, words_limit) {
        if (life_limit === "off") {
            life_limit = 0;
        } else {
            life_limit = livesunit;
        }
        /* parameter structure
         * time_limit 0 for unlimited
         * life_limit 0 for unlimited
         * guife true/false
         * lavel-> integer index of level
         */
        var all_words = gameConfig.config.levels[level].words;
        application.helper.shuffleArray(all_words);
        var selected_words = all_words.slice(0, words_limit);
        //application.game.createWordsArray(selected_words);
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
            "time_limit": time_limit,
            "life": {"life_limit": life_limit, "life_remains": life_limit},
            "guide": guide,
            "word_limit": words_limit,
            "level": level,
            "current_word_index": 0,
            "score": 0,
            "words": application.game.createWordsArray(selected_words)
        };
        // alert(JSON.stringify(currentGame["words"][0]["last_status"]));

    },
    startGame: function () {
        application.gui.setupNewWord(currentGame["words"][0]["last_status"]);
        if (currentGame["life"]["life_limit"] === 0) {
            $("#lifes_div").html("unlimited");
        }
        if (currentGame["time_limit"] !== "0") {
            TotalSeconds = currentGame["time_limit"] * 60;
            application.helper.createTimer();
        } else {
            $("#time_div").html("No Limit");
        }
    },
    checkCurrentWord: function () {
        var arr = $("#sortable li").map(function () {
            return $(this).text();
        }).get();
        var curr_word = currentGame["words"][currentGame["current_word_index"]]["word"];
        if (application.helper.comapreArray(curr_word, arr)) {
            currentGame["words"][currentGame["current_word_index"]]["status"] = 2;
            application.game.updateScore();
            $("#sortable").sortable("destroy");
            $("#btn-check").addClass("ui-disabled");
            $("#btn-skip").html("Next");
            $("#word_result").html('<image src="assets/css/images/timers/tick1.png" style="width: 40px;" />');
        } else {
            currentGame["words"][currentGame["current_word_index"]]["status"] = 1;
            $("#word_result").html('<image src="assets/css/images/timers/cross1.png" style="width: 30px; height: 40px;" />');
            application.game.updateLifes();
        }
    },
    skipCurrentWord: function () {

    },
    finishGame: function () {
        //alert("sd");
        $("#score-dispaly").html("Your Score Is: " +currentGame["score"]  );
        $("#popupFinish").popup({
            dismissible: false,history: false
        });
        $("#popupFinish").popup( "open" );
    },
    updateGuide: function () {
        var arr = $("#sortable li").map(function () {
            return $(this).text();
        }).get();
        var curr_word = currentGame["words"][currentGame["current_word_index"]]["word"];
        var i = arr.length;
        i--;
        var check = true;
        while (i >= 0) {
            if (arr[i] !== curr_word[i]) {
                $("#sortable li:nth-child(" + (i + 1) + ")").css("background-color", "#2a2a2a");
                $("#sortable li:nth-child(" + (i + 1) + ")").css("border-color", "#454545");
                check = false;
            }
            else {
                $("#sortable li:nth-child(" + (i + 1) + ")").css("background-color", "darkgreen");
                $("#sortable li:nth-child(" + (i + 1) + ")").css("border-color", "darkgreen");
            }
            i--;
        }
        if (check) {
            application.game.checkCurrentWord();
        }
    },
    updateScore: function () {
        currentGame["score"] += scoreunit;
        $("#score_div").html(currentGame["score"] + " / " + (scoreunit * currentGame["word_limit"]));
    },
    updateLifes: function () {
        if (currentGame["life"]["life_limit"] !== 0) {
            if (currentGame["life"]["life_remains"] > 0) {
                currentGame["life"]["life_remains"] = currentGame["life"]["life_remains"] - 1;
                $("#lifes_div").append('<image src="assets/css/images/timers/cross1.png" style="width: 30px;" />');
            } else {
                application.game.finishGame();
            }
        }
    },
    setNextWord: function () {
        if (currentGame["current_word_index"] >= (currentGame["word_limit"] - 1)) {
            application.game.finishGame();
        }
        else {
            var arr = $("#sortable li").map(function () {
                return $(this).text()
            }).get();
            currentGame["words"][currentGame["current_word_index"]]["last_status"] = arr;
            currentGame["current_word_index"] = currentGame["current_word_index"] + 1;
            application.gui.setupNewWord(currentGame["words"][currentGame["current_word_index"]]["last_status"]);
        }
    },
    createWordsArray: function (selected_words) {
        var wordJson = {words: []};
        for (var i = 0; i < selected_words.length; i++) {
            var suff_word = selected_words[i].split(""); //shuffle word
            application.helper.shuffleArray(suff_word);
            wordJson.words.push({
                "word": selected_words[i],
                "status": 0,
                "last_status": suff_word
            });
        }
        return wordJson.words;
        /*
         * status 0->not attempted 1->attempted 2->correct
         */
    }
};

application.gui = {
    addLevelAtStartPage: function (levels) {
        var html = "";
        $.each(levels, function (i, item) {
            name = item.name;
            if (i === 0) {
                html += '<input type="radio" name="level" id="' + name + '" value="' + i + '" checked="checked"><label for="' + name + '">' + name + '</label>';
            }
            else {
                html += '<input type="radio" name="level" id="' + name + '" value="' + i + '"><label for="' + name + '">' + name + '</label>';
            }
        });
        var $radios1 = $('<fieldset id="levelList" data-role="controlgroup" data-type="horizontal" data-mini="true">').prepend(html);
        $('#levelListControlGroup').prepend($radios1).trigger('create');
    },
    addTimeLimitAtStartPage: function (timeLimits) {
        //timelimit
        var html = '<option value="0">No Time Limit</option>';
        $.each(timeLimits, function (i, item) {
            html += '<option value="' + item + '">' + item + ' mins</option>';
        });
        $("#timelimit").append(html);
        $("#timelimit").selectmenu('refresh');
    },
    addWordLimitAtStartPage: function (WordLimits) {
        var limit = 0;
        var html = '';
        if (WordLimits <= 5) {
            for (limit = 1; limit <= WordLimits; limit++) {
                html += '<option value="' + limit + '">' + limit + ' words</option>';
            }
        }
        else {
            for (limit = 5; limit <= WordLimits; limit += 5) {
                html += '<option value="' + limit + '">' + limit + ' words</option>';
            }
        }
        $("#noofword").append(html);
        $("#noofword").selectmenu('refresh');
    },
    setupNewWord: function (word) {
        $("#word_div").html((currentGame['current_word_index'] + 1) + " / " + currentGame['word_limit']);
        var htm = "";
        $.each(word, function (i, item) {
            var char = item;
            htm += '<li>' + char + '</li>';
        });
        $('#sortable').empty();
        $('#sortable').html(htm);
        $("#sortable").sortable();
        $('#sortable').listview('refresh');
        $("#sortable li:last").removeClass("ui-last-child");
        if (currentGame["guide"] !== "off") {
            application.game.updateGuide();
        }
        $("#btn-check").removeClass("ui-disabled");
        $("#btn-skip").html("Skip");
        application.gui.setWordSortableCenter();
    },
    setWordSortableCenter: function () {
        //var toppos=($(window).height()/2) - ($("#word-sortable").height()/2);
        var ulWidth = 0;
        $("li").each(function () {
            ulWidth = ulWidth + $(this).width()
        });
        //alert("ul "+ulWidth);
        //alert("window "+$( window ).width());
        //alert("word shorable "+$("#word-sortable").width());
        var leftpos = (($("#word-sortable").width() - 200) - (ulWidth + 35)) / 2;
        // alert(leftpos);
        $("#sortable:first-child").css("margin-left", leftpos + "px");
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
    },
    comapreArray: function (a, b) {
        var i = a.length;
        if (i !== b.length)
            return false;
        while (i--) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    },
    createTimer: function (TimerID, Time) {
        application.helper.updateTimer()
        window.setTimeout("application.helper.tick()", 1000);
    },
    tick: function () {
        //alert(TotalSeconds);
        if (TotalSeconds <= 0) {
            application.game.finishGame();
            return;
        }
        if(gamefinished){
            return;
        }
        TotalSeconds -= 1;
        application.helper.updateTimer();
        window.setTimeout("application.helper.tick()", 1000);
    },
    updateTimer: function () {
        var Seconds = TotalSeconds;
        var Days = Math.floor(Seconds / 86400);
        Seconds -= Days * 86400;
        var Hours = Math.floor(Seconds / 3600);
        Seconds -= Hours * (3600);
        var Minutes = Math.floor(Seconds / 60);
        Seconds -= Minutes * (60);
        var TimeStr = ((Days > 0) ? Days + " days " : "") + application.helper.leadingZero(Hours) + ":" + application.helper.leadingZero(Minutes) + ":" + application.helper.leadingZero(Seconds);
        $("#time_div").html(TimeStr);
    },
    leadingZero: function (Time) {
        return (Time < 10) ? "0" + Time : +Time;
    }
};
application.event = {
    setUpOneTimeEventOfStartPage: function () {
        $(document).on("change", "input[type=radio][name=level]", function () {
            var WordLimits = gameConfig["config"]["levels"][$(this).val()]["words"].length;
            $("#noofword").empty();
            application.gui.addWordLimitAtStartPage(WordLimits);
        });
        $(document).on("click", "#startGame", function () {
            var level = $("#levelListControlGroup :radio:checked").val();
            var time = $("#timelimit option:selected").val();
            var words = $("#noofword option:selected").val();
            var lifes = $("#lifes option:selected").val();
            var guide = $("#guide option:selected").val();
            application.game.createNewGame(time, lifes, guide, level, words);
            $.mobile.changePage("Game.html", {transition: "flip", changeHash: false, allowSamePageTransition: true});

        });
        $(document).on("click", "#btn-skip", function () {
            application.game.setNextWord();
            $("#word_result").empty();
        });
        $(document).on("click", "#btn-check", function () {
            application.game.checkCurrentWord();
        });
        $(document).on("click", "#btn-restart", function () {
            window.location.reload();        
        });
        $(document).on("click", "#btn-finish", function () {
            application.game.finishGame();
        });
        $(document).on("pageshow", "#homePage", function (event, data) {
            $("#sortable").sortable();
            $("#sortable li:last").removeClass("ui-last-child");
            $("#sortable").disableSelection(); // Refresh list to the end of sort to have a correct display -- >

            $("#sortable").bind("sortstop", function (event, ui) {
                $('#sortable').listview('refresh');
                $("#sortable li:last").removeClass("ui-last-child");
                $("#word_result").empty();
                if (currentGame["guide"] !== "off") {
                    application.game.updateGuide();
                }
            });
            application.game.startGame();
        });
    }
};