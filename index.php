<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>OddTimer</title>
		<link rel="stylesheet" type="text/css" href="styles/timer.css">
		<script type="text/javascript" src="scripts/timer.js"></script>
		<script type="text/javascript" src="scripts/mathlib.js"></script>
		<script type="text/javascript" src="scripts/jquery.js"></script>
		<script type="text/javascript" src="scripts/mersennetwister.js"></script>
		<script type="text/javascript" src="scripts/scramblers/mega.js"></script>
		<script type="text/javascript" src="scripts/scramblers/222.js"></script>
		<script type="text/javascript" src="scripts/scramblers/333.js"></script>
		<script type="text/javascript" src="scripts/scramblers/sq1.js"></script>
		<script type="text/javascript" src="scripts/scramblers/pyra.js"></script>
		<script type="text/javascript" src="scripts/scramblers/skewb.js"></script>
	</head>
	<body>
		<center>
			<div id="blurFocus"> BLUR.... Click anywhere to focus!</div>
			<input id="showTime" value="0.00" class="timerDefault" readonly />
			<div id="sessionSnippet"></div>
			<div id="scrambleBox" onclick="hideshowScramble()"></div>
			<div id="scrambleSelect" onclick="hideshowScramble()"><h3>Select Puzzle:</h3>
				<table>
					<tr>
						<td>
							<span onclick="changepuzzle(this.id)" id="222wca">2x2x2 (WCA)</span><br />
							<span onclick="changepuzzle(this.id)" id="333wca">3x3x3 (WCA)</span><br />
							<span onclick="changepuzzle(this.id)" id="444wca">4x4x4 (WCA)</span><br />
							<span onclick="changepuzzle(this.id)" id="555wca">5x5x5 (WCA)</span><br />
							<span onclick="changepuzzle(this.id)" id="666wca">6x6x6 (WCA)</span><br />
							<span onclick="changepuzzle(this.id)" id="777wca">7x7x7 (WCA)</span><br />
						</td>
						<td>
							<span onclick="changepuzzle(this.id)" id="sq1">Square-1 (WCA)</span><br />
							<span onclick="changepuzzle(this.id)" id="megacarrot">Megaminx (Carrot)</span><br />	
							<span onclick="changepuzzle(this.id)" id="pyrawca">Pyraminx (WCA)</span><br />			
							<span onclick="changepuzzle(this.id)" id="skewb">Skewb (WCA)</span><br />	
							<span onclick="changepuzzle(this.id)" id="clockcon">Clock (Concise)</span><br />
						</td>
					</tr>
				</table>
				<br/>			
			</div>
			
		</center>
		<div id="sessions">
			<b>Current Session:</b> <br />
			<span id="currentSession">ehhhh? no session detected...</span><br /> <br />
			<b>Select Session:</b> <br /> <br />
			<span class="sessionSelect" onclick="changeSession(this.id);changepuzzle('222wca')" id="session1">2x2x2</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id);changepuzzle('333wca')" id="session2">3x3x3</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id);changepuzzle('444wca')" id="session3">4x4x4</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id);changepuzzle('555wca')" id="session5">5x5x5</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id);changepuzzle('666wca')" id="session6">6x6x6</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id);changepuzzle('777wca')" id="session7">7x7x7</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id);changepuzzle('sq1')" id="times">Square-1</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id);changepuzzle('pyrawca')" id="session9">Pyraminx</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id);changepuzzle('megacarrot')" id="session4">Megaminx</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id);changepuzzle('skewb')" id="session10">Skewb</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id);changepuzzle('clockcon')" id="session17">Clock</span><br /><br />
			
			<span class="sessionSelect" onclick="changeSession(this.id)" id="session11">Session 1</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id)" id="session12">Session 2</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id)" id="session13">Session 3</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id)" id="session15">Session 4</span><br />
			<span class="sessionSelect" onclick="changeSession(this.id);changepuzzle('oliverFrost')" id="session16">EXPERIMENTAL BLD SCRAMBLER (WILL CRASH YOU BROWSER 10% OF THE TIMES!)</span><br /><br />
			<span class="sessionSelect" onclick="promptClearSession()">Clear current session</span>
		</div>
		<div id="stats" onclick="hideshowStats()"><b>Stats preview:</b> <br /> <br />
			Current avg5: <span id='currentAvg5'>-.--</span><br />
			Best avg5: <span id='bestAvg5'>-.--</span><br /><br />
			
			Current avg12: <span id='currentAvg12'>-.--</span><br />
			Best avg12: <span id='bestAvg12'>-.--</span><br /><br />
			
			Session: <span id='sessionAvg'>-.--</span><br />
		</div>
		<div id="fullStatsContainer">
			<div id="printStatsBox"></div>
			<div id="statsControllerBox">
				<form id="statsController"><b>Custom Selection:</b><br />
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="0">General Statistics<br><br />
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="3">Mean of 3<br>
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="5">Average of 5<br />
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="12">Average of 12<br />
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="25">Average of 25<br />
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="50">Average of 50<br />
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="100">Average of 100<br />
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="200">Average of 200<br />
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="500">Average of 500<br /><br />
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="-1">All scrambles<br />
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="-4">Hide scrambles<br />
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="-5">Hide times<br /><br />
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="-2">Forum friendly<br />
					<input onclick="generateCustomStats()" type="checkbox" name="showStats" value="-3">NOT WORKING! Select All (for easy copy-paste) <br />
					
				</form>
			</div>
		</div>
	</body>
</html>