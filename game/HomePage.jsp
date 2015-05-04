<%@ page import="java.util.*" %>

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
		<script>
			$(document).ready(function() {
				alert("ss");
				$( "#sortable" ).sortable();
				$( "#sortable" ).disableSelection();
				<!-- Refresh list to the end of sort to have a correct display -->
				$( "#sortable" ).bind( "sortstop", function(event, ui) {
					$('#sortable').listview('refresh');
				});
			});
		</script>
		<script type="text/javascript" src="js/timer.js"></script>
		
		<style type="text/css">
			li {
				float: left;
			}
			
			body {
				background-image: url('css/images/backgrounds/background11.jpg');
			}
			
			#sortable {
				cursor: -webkit-grab; 
				cursor: -moz-grab;
			}
		</style>
	</head>
	<body>
	
		<div data-role="page" data-theme="b" style=" background-image: url('css/images/background1.jpg');">

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
						</div><br/>
						
						<form id="game_start_form">								
							<div style="height: 450px; width: 600px; margin-top: 20px;">	
							<div class="ui-grid-b">
								<div id="lifes" class="ui-block-a">Lifes:<br/>
									<image src="css/images/timers/cross1.png" style="width: 30px;" />
									<image src="css/images/timers/cross1.png" style="width: 30px;" />
									<image src="css/images/timers/cross1.png" style="width: 30px;" />
								</div>
								<div class="ui-block-b">
									<image src="css/images/timers/timer3.gif" style="width: 50px;" /><span id="time"><%= request.getParameter("timelimit") %>:00</span>
								</div>
								<div class="ui-block-c">
									1/<%= request.getParameter("noofwords") %>
								</div>
							</div>
							<br/><br>
							<center>
								<div class="ui-grid-solo">
									<div class="ui-block-a">
										<% String[] words={"TAC","BOTTLE","PEACOCK","ROSE"}; %>
										<label id="jumbled_word"><%= words[2] %></label>
									</div>
								</div>
										
								<% 
									int word_len = words[2].length();
									ArrayList chars = new ArrayList();
									
									for (int i = 0; i < word_len; i++) {
										chars.add(words[2].charAt(i));
									}
								%>
								
								<div class="ui-grid-a">
									<div class="ui-block-a" style="padding-top: 20px; padding-left: 10px;">										
										<ul data-role="listview" id="sortable" data-type="horizontal">
											<%
												for(int i=0; i<chars.size(); i++) {
											%>
												<li><%= chars.get(i) %></li>
											<%
												}
											%>
										</ul>
									</div>
									<div class="ui-block-b" style="float: right;">
										<image src="css/images/timers/tick1.png" style="width: 40px;" />
										<image src="css/images/timers/cross1.png" style="width: 30px; height: 40px;" />
									</div>
								</div>
							</center>
							
							<div class="ui-grid-a">
							</div>
						</form>
					
					<!--	<h4 class="animated bounceInLeft slower" style="margin-bottom: 0px;">Click on the link to see the pop effect.</h4>
						<div class="animated bounceInRight slower"><a href="StartPage.jsp" data-transition="pop">Pop to Page Two</a></div> -->
					</div>
				</div>
			</div>
		</div> 
	</body>
</html>
<script src='js/css3-animate-it.js'></script>