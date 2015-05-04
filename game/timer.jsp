<html>
	<head>
		<script type="text/javascript" src="js/jquery-2.1.3.min.js"></script>
		<script type="text/javascript">

			function startTimer(duration, display) {
				var timer = duration, minutes, seconds;
				//alert(timer);
				var interval = setInterval(function () {
					minutes = parseInt(timer / 60, 10)
					//alert(minutes);
					seconds = parseInt(timer % 60, 10);
					//alert(seconds);

					minutes = minutes < 10 ? "0" + minutes : minutes;
					seconds = seconds < 10 ? "0" + seconds : seconds;

					display.text(minutes + ":" + seconds);

					if (--timer < 0) {	
						clearInterval(interval);						
						//timer = duration;
						
					} 
					
				}, 1000);
				
			}

			jQuery(function ($) {
				var fiveMinutes = 60 * 1,
					display = $('#time');
				startTimer(fiveMinutes, display);
			});
			
		</script>
	</head>

	<body>
		<div>Registration closes in <span id="time">01:00</span> minutes!</div>
	</body>
</html>

<!-- <html>
	<head>
		<style type="text/css">

			body {
				cursor:default;
			}
		</style>

		<script type="text/javascript" src="js/jquery-2.1.3.min.js"></script>
		<script type="text/javascript">
		/*	function change() {
				document.body.style.cursor="help";
			} */
			$(document).ready(function() {
			/*	alert("Hii");
				if ( $.browser.webkit ) {
					alert( "This is WebKit!" );
				}
				else{
					alert("No");
				} */
				if(navigator.userAgent.search("Chrome") >= 0) {
					alert("Chrome");
				} 
			//else if ($.browser.mozilla) {
			//   alert("Mozilla");
			});
			
		</script>
	</head>

	<body>

		<div>
			Click here!
		</div>

	</body>
</html> -->