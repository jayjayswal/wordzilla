function startTimer(duration, display) {
	var timer = duration, minutes, seconds;
	setInterval(function () {
		minutes = parseInt(timer / 60, 10)
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		display.text(minutes + ":" + seconds);

		if (--timer < 0) {
			timer = duration;
		}
	}, 1000);
}

jQuery(function ($) {
	var timeLimitString = $("#time").text();
	var timeLimitInt = parseInt(timeLimitString);
	var fiveMinutes = 60 * timeLimitInt,
		display = $('#time');
	startTimer(fiveMinutes, display);
});

$(document).ready(function() {	
	if(navigator.userAgent.search("Chrome") >= 0) {
		$( "#sortable" ).sortable({
			cursor: "-webkit-grabbing"
		});
	} 
	else if(navigator.userAgent.search("Firefox") >= 0) {
		$( "#sortable" ).sortable({
			cursor: "-moz-grabbing"
		});
	}	
});
