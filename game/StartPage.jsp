<!DOCTYPE html>
<html>
	<head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="css/animations.css" />
		<link rel="stylesheet" href="css/loader.css" />		
		<link rel="stylesheet" href="css/jquery-ui.css" />
		<link rel="stylesheet" href="css/jquery.mobile-1.4.2.min.css" />
		
		<script type="text/javascript" src="js/jquery-2.1.3.min.js"></script>		
		<script type="text/javascript">			
			$(document).bind("mobileinit", function(){
				$.mobile.defaultPageTransition = 'pop';
				//$.mobile.transitionFallbacks.slideout = 'pop';
			});
		</script>
		<script type="text/javascript" src="js/jquery-ui.js"></script>
		<script type="text/javascript" src="js/jquery.mobile-1.4.2.min.js"></script>		
		<script type="text/javascript">
			$(document).ready(function() {	
				$(".ui-content").hide();
				$(function() {
					// run the currently selected effect
					function runEffect() {
						// run the effect
						$( "#main-div" ).show( "scale", {percent: 100, origin:'center'}, 1500);
						//$( "#main-div" ).show( "explode", {pieces: 16, mode:'show'}, 1500);
					};
					$(window).load(function() {
						runEffect();
						return false;
					});
				$("#main-div").hide();
			});
		});
		 
		$(window).load(function() {
			$("#loading").delay(3000).fadeOut(500);
			$(".ui-content").show(3000);
		});
		</script>
	</head>
	<body style="background-image: url('css/images/backgrounds/background11.jpg');">
	
		<div id="loading">
			<div id="loading-center">
				<div id="loading-center-absolute">
					<div class="object" id="object_one"></div>
					<div class="object" id="object_two"></div>
					<div class="object" id="object_three"></div>
					<div class="object" id="object_four"></div>
					<div class="object" id="object_five"></div>
					<div class="object" id="object_six"></div>
					<div class="object" id="object_seven"></div>
					<div class="object" id="object_eight"></div>
					<div class="object" id="object_big"></div>
				</div>
			</div>
		</div>
		
		<div data-role="page" id="pageone" data-theme="b" style=" background-image: url('css/images/background1.jpg');">

			<div data-role="main" class="ui-content">
				<div id="main-div" style="width:500px; margin-left: auto; margin-right: auto; padding: 20px;">
					<div class="animatedParent">
						<div class="animatedParent" data-sequence="1000">
							<div class='animated fadeInLeft slower' data-id='1'>
								<img src="css/images/alphabets/w.png" style="width: 50px;" />
								<img src="css/images/alphabets/o.png" style="width: 50px;" />
								<img src="css/images/alphabets/r.png" style="width: 50px;" />
								<img src="css/images/alphabets/d.png" style="width: 50px;" />
								<img src="css/images/alphabets/z.png" style="width: 50px;" />
								<img src="css/images/alphabets/i.png" style="width: 50px;" />
								<img src="css/images/alphabets/l.png" style="width: 50px;" />
								<img src="css/images/alphabets/l.png" style="width: 50px;" />
								<img src="css/images/alphabets/a.png" style="width: 50px;" />
							</div>
						</div>
						
						<form id="game_setup_form" action="HomePage.jsp" method="get">								
							<h4 class="animated bounceInLeft slower" style="margin-bottom: 0px;">Level:</h4>
							<div class="animated bounceInRight slower">
								<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">
									<input type="radio" name="level" id="veryeasy" value="veryeasy" checked="checked">
									<label for="veryeasy">Very Easy</label>
									<input type="radio" name="level" id="easy" value="easy">
									<label for="easy">Easy</label>						
									<input type="radio" name="level" id="medium" value="medium">
									<label for="medium">Medium</label>
									<input type="radio" name="level" id="hard" value="hard">	
									<label for="hard">Hard</label>								
									<input type="radio" name="level" id="veryhard" value="veryhard">	
									<label for="veryhard">Very Hard</label>
								</fieldset>
							</div>
						
							<div class="ui-grid-a">
								<div class="ui-block-a">
									<h4 class="animated bounceInLeft slower" style="margin-bottom: 0px;">Time Limit:</h4>
									<div class="animated bounceInRight slower">
										<div class="ui-field-contain">
										    <label for="timelimit" class="ui-hidden-accessible">Time Limit:</label>
										    <select name="timelimit" id="timelimit" data-native-menu="false" data-mini="true">
												<option value="0">No Time Limit</option>
										        <option value="5">5 mins</option>
										        <option value="10">10 mins</option>
										        <option value="15">15 mins</option>
										        <option value="20">20 mins</option>
										    </select>
										</div>
									</div>
								</div>

								<div class="ui-block-b">
									<h4 class="animated bounceInLeft slower" style="margin-bottom: 0px;">Number of Words:</h4>
									<div class="animated bounceInRight slower">
										<div class="ui-field-contain">
										    <label for="noofwords" class="ui-hidden-accessible">Number of Words:</label>
										    <select name="noofwords" id="noofwords" data-native-menu="false" data-mini="true">
										        <option value="10">10</option>
										        <option value="15">15</option>
										        <option value="20">20</option>
										        <option value="25">25</option>
										    </select>
										</div>
									</div>
								</div>
							</div>
						
							<div class="ui-grid-a">
								<div class="ui-block-a">
									<h4 class="animated bounceInLeft slower" style="margin-bottom: 0px;">Lifes:</h4>
									<div class="animated bounceInRight slower">
									    <select name="lifes" id="lifes" data-role="slider" data-mini="true">
									        <option value="off">Off</option>
									        <option value="on">On</option>
									    </select>
									</div>
								</div>
								
								<div class="ui-block-b">
									<h4 class="animated bounceInLeft slower" style="margin-bottom: 0px;">Guides:</h4>
									<div class="animated bounceInRight slower">
									    <select name="guide" id="guide" data-role="slider" data-mini="true">
									        <option value="off">Off</option>
									        <option value="on">On</option>
									    </select>
									</div>
								</div>
							</div>						
						
							<div class="animated bounceInRight slower">
								<center>
									<input type="submit" ajax="false" class="ui-btn ui-btn-inline ui-corner-all" data-transition="pop" style="background-color: Green;" value="Start Game" />
								</center>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div> 		
	</body>
</html>
<script src='js/css3-animate-it.js'></script>