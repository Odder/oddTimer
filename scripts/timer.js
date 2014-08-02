var timerState = 0; // 0=not running; 1=getting ready; 2=ready; 3=running; 4=swimming
var startTime;
var currentTime;
var timerInterval;
var timerDelay;
var times = [];
var currentSession;
var scrambles = [];
var scramble;
var sessionNames = {session1: '2x2x2', 
	session2: '3x3x3', 
	session3: '4x4x4', 
	session4: 'Megaminx', 
	session5: '5x5x5', 
	session6: '6x6x6', 
	session7: '7x7x7', 
	times: 'Square-1', 
	session9: 'Pyraminx', 
	session10: 'Skewb', 
	session11: 'Session 1', 
	session12: 'Session 2', 
	session13: 'Session 3', 
	session14: 'Session 4', 
	session15: 'Session 5'};


/**
	TO DO LIST:
		Robert Yau:
			8,12 seconds beep.
		Moroder:
			Statistik
			Mulighed for inspection
			eventuelt mulighed for BLD mode
			Mulighed for at vælge farver på timeren
			Navngiving af Sessions
			og så man kan se at musen er over noget, ved det skifter til en anden farve
			Gem scrambles
		Jesper:
			Inspektion
			penalties!
			00-banner!
		giraffe:
			PB-banner!
		Odder:
			import sessions fra CStimer og QQtimer
		Oliver Frost:
			I think bld solvers like having a bld mode, Which times memo
			
**/

// shortcut functions
function El(el) {return document.getElementById(el);}

// global listeners
window.onkeydown = function(event) {checkKey(event.keyCode, 1);};
window.onkeyup = function(event) {checkKey(event.keyCode, 0); formatPretty();};
window.onblur = function(event) {El("blurFocus").style.visibility =  "visible"; console.log("yolo");};
window.onfocus = function(event) {El("blurFocus").style.visibility = "hidden";};
function setFocusListener() {El("showTime").onfocus = function(event) {if (El("showTime").value == "0.00") {El("showTime").value = "";}}}
function setBlurListener() {El("showTime").onblur = function(event) {if (El("showTime").value == "") {El("showTime").value = "0.00";}}}
window.onload = onloadFunctions;

function onloadFunctions() {
	setFocusListener();
	setBlurListener();
	initialiseLocalStorage();
	loadSession();
	newScramble();
	updatePreviewStats();
}

function initialiseLocalStorage() {
	if (localStorage.scrambleType == null) {localStorage.scrambleType = "333wca";}
	if (localStorage.sessionSelector == null) {localStorage.sessionSelector = "times";}
}


/*** TIMER FUNCTIONS ***/
function checkKey(key, action) {
	if (action == 0 && timerState == 0 && (El("showTime").value == pretty(times[times.length - 1]) || El("showTime").value == ""|| El("showTime").value == "0.00") && ((key > 47  && key < 58) || (key > 95 && key < 106))) { 
		El("showTime").focus();
		El("showTime").value = String.fromCharCode(key);
	}
	if (action == 0) {clearTimeout(timerDelay); }
	if (key == 32 &&  timerState == 0 && action == 1) {prepareTimer(); }
	else if (timerState == 3) {stopTimer(); }
	else if (key == 32 && timerState == 1 && action == 0) {timerState = 0; El("showTime").className = "timerDefault";}
	else if (key == 32 && timerState == 2 && action == 0) {startTimer() }
	else if (key == 13 && action == 1) {manualInput(); }
	console.log(key);
}

function startTimer() {
	startTime = new Date();
	timerInterval = setInterval(updateTimer, 70);
	timerState = 3;
	El("showTime").className = "timerDefault";
}
function updateTimer() {
	currentTime = new Date();
	diffTime = currentTime.getTime() - startTime.getTime();
	El("showTime").value = pretty(diffTime);
}
function prepareTimer() {
	timerState = 1;
	if (El("showTime").value == "") {El("showTime").value = "0.00";}
	El("showTime").className = "timerPreparing";
	El("showTime").blur();
	timerDelay = setTimeout(function (){timerState = 2;El("showTime").className = "timerReady";El("showTime").value = "0.00";}, 300)
}
function stopTimer() {
	clearInterval(timerInterval);
	currentTime = new Date();
	diffTime = currentTime.getTime() - startTime.getTime();
	El("showTime").value = pretty(diffTime);
	times[times.length] = diffTime;
	scrambles[times.length - 1] = scramble;
	timerState=0;
	updateSessionSnippet();
	storeSession();
	updatePreviewStats()
	newScramble();
}

function manualInput() {
	if (ugly(El("showTime").value) == 0) { return;}
	times[times.length] = ugly(El("showTime").value);
	scrambles[times.length - 1] = scramble;
	updateSessionSnippet();
	storeSession();
	updatePreviewStats()
	newScramble();
	El("showTime").value = "";
}
function formatPretty(){
	inputTimerText = El("showTime").value.replace(":","").replace(".","").replace("\n","");
	if(inputTimerText.length > 2)  {
		inputTimerText = inputTimerText.substr(0,inputTimerText.length-2) + "." + inputTimerText.substr(-2);
	}
	if(inputTimerText.length > 5) {
		inputTimerText = inputTimerText.substr(0,inputTimerText.length-5) + ":" + inputTimerText.substr(-5);
	}
	El("showTime").value = inputTimerText;
}


/*** SESSION FUNCTIONS ***/
function storeSession() {
	localStorage[currentSession] = times;
	localStorage[currentSession + "scrambles"] = scrambles;
}
function updateSessionSnippet() {
	times.length == 1 ? postfix = "" : postfix = ", ";
	El("sessionSnippet").innerHTML = "<span onclick='promptDelete(this.id)' class='timeSnippet' id='solve" + (times.length-1) + "'>" + pretty(times[times.length-1]) + "</span>" + postfix + El("sessionSnippet").innerHTML;
}
function loadSessionSnippet(time, index) {
	index == 0 ? postfix = "" : postfix = ", ";
	El("sessionSnippet").innerHTML = "<span onclick='promptDelete(this.id)' class='timeSnippet' id='solve" + (index) + "'>" + pretty(time) + "</span>" + postfix + El("sessionSnippet").innerHTML;
}
function loadSession() {
	El("sessionSnippet").innerHTML = "";
	El("currentSession").innerHTML = sessionNames[localStorage.sessionSelector];
	currentSession = localStorage.sessionSelector;
	times = [];
	scrambles = []
	if (localStorage[currentSession] != 0 && localStorage[currentSession] != null) {
		times = localStorage[currentSession].split(",").map(toInt);
		times.map(loadSessionSnippet);
		scrambles = localStorage[currentSession + "scrambles"].split(",");
	}
}
function promptDelete(id) {
	index = id.replace("solve","");
    if (confirm("Are you sure you want to delete " + pretty(times[index]) + "?") == true) {
       deleteTime(index);
    }
}
function promptClearSession() {
    if (confirm("Are you sure you want to clear this session?") == true) {
       clearSession();
    }
}
function deleteTime(index) {
	times.splice(index, 1);
	storeSession();
	loadSession();
	updatePreviewStats()
}
function clearSession() {
	localStorage[currentSession] = "";
	times = [];
	loadSession();
	updatePreviewStats()
	return times;
}
function changeSession(newSession) {
	localStorage.sessionSelector = newSession;
	loadSession();
	updatePreviewStats()
}

/*** STATS STUFF ***/
function calcAvgX(set) {
	sum = 0;
	//cutOff = (set.length / 10) | 0;
	//cutOff == 0 ? cutOff = 1 : 0;
	slowest = Math.max.apply(null,set);
	fastest = Math.min.apply(null,set);
	for (i = 0; i < set.length; i++) {
		sum += set[i];
	}
	//console.log(sum, slowest, fastest, set);
	return (4.9 + ((sum - (fastest + slowest)) / (set.length - 2))) | 0;
}
function calcMeanX(set) {
	sum = 0;
	for (i = 0; i < set.length; i++) {
		sum += set[i];
	}
	//console.log(sum, slowest, fastest, set);
	return (4.9 + ((sum) / (set.length - 2))) | 0;
}
function fastestAvgX(size) {
	if (times.length < size) {return false;}
	index = 0;
	bestAvg = [9999999999, 0];
	
	//console.log(bestAvg[0], bestAvg[1]);
	for (j = 0; j <= times.length - size; j++) {
		current = calcAvgX(times.slice(j,j+size));
		if (current < bestAvg[0]) {bestAvg = [current, j];}
		//console.log(current, bestAvg[0], bestAvg[1]);
	}
	//console.log(bestAvg[0], bestAvg[1]);
	return [bestAvg[0], bestAvg[1]];
}
function currentAvgX(size) {
	if (times.length < size) {return "-.--";}
	return calcAvgX(times.slice(times.length-size,times.length));
	//console.log(times.slice(times.length-size,times.length));
}
function fastestMeanX(size) {
	if (times.length < size) {return false;}
	index = 0;
	bestMean = [9999999999, 0];
	
	//console.log(bestAvg[0], bestAvg[1]);
	for (j = 0; j <= times.length - size; j++) {
		current = calcMeanX(times.slice(j,j+size));
		if (current < bestMean[0]) {bestMean = [current, j];}
		//console.log(current, bestAvg[0], bestAvg[1]);
	}
	//console.log(bestAvg[0], bestAvg[1]);
	return [bestMean[0], bestMean[1]];
}
function currentMeanX(size) {
	if (times.length < size) {return "-.--";}
	return calcMeanX(times.slice(times.length-size,times.length));
	//console.log(times.slice(times.length-size,times.length));
}
function updatePreviewStats() {
	if (times.length > 4) {
		El('currentAvg5').innerHTML = pretty(currentAvgX(5));
		El('currentAvg5').innerHTML += "<br />" + prettyPrint(printAvgX(times.length - 5, 5));
		El('bestAvg5').innerHTML = pretty((bestAvg5 = fastestAvgX(5))[0]);
		El('bestAvg5').innerHTML += "<br />" + prettyPrint(printAvgX(bestAvg5[1], 5));
	} else { El('currentAvg5').innerHTML = "-.--"; El('bestAvg5').innerHTML = "-.--"; }
	if (times.length > 11) {
		El('currentAvg12').innerHTML = pretty(currentAvgX(12));
		El('currentAvg12').innerHTML += "<br />" + prettyPrint(printAvgX(times.length - 12, 12));
		El('bestAvg12').innerHTML = pretty((bestAvg5 = fastestAvgX(12))[0]);
		El('bestAvg12').innerHTML += "<br />" + prettyPrint(printAvgX(bestAvg5[1], 12));
	} else { El('currentAvg12').innerHTML = "-.--"; El('bestAvg12').innerHTML = "-.--"; }
	if (times.length > 2) {
		El('sessionAvg').innerHTML = pretty(calcAvgX(times)) + "<br />(" + times.length + " solves)";
	} else { El('sessionAvg').innerHTML = "-.--";}
}
function printAvgX(index, size) {
	console.log(index, size);
	return times.slice(index, index+toInt(size));
}
function getPartialTimelist(index, size) {
	timeList = "";
	for (i = index; i < index + size; i++) {
		timeList += (i - index + 1) + ")&nbsp;&nbsp;" + pretty(times[i]) + "&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;" + scrambles[i] + "<br />";
	}
	return timeList;
}
function getFullTimeList() {
	return getPartialTimelist(0, times.length);
}
function createStats() {
	outputStats = "** using oddTimer ** (hehe, it's a pretty awesome timer, huh?)<br /><br />";
	outputStats += "Best solve: " + pretty(Math.min.apply(null,times)) + " <br />";
	outputStats += "Worst solve: " + pretty(Math.max.apply(null,times)) + " <br /><br />";
	
	/**
	outputStats += "Time Distribution:<br />";
	
	distribution = [];
	for (var i = 0; i < 120; i++) distribution[i] = 0;
	for(var i in times)
	{
		distribution[(times[i]/1000) | 0]++;
	}
	for(var a=0;a<120;a++)
	{
		if(distribution[a] > 0)
		{
			outputStats += a + ": " + distribution[a] + "<br />";
		}
	}
	outputStats += "<br />";
	**/
	if (times.length > 2) {
		outputStats += "Current Mo3: " + pretty(currentMeanX(3)) + "<br />" + prettyPrint(printAvgX(times.length - 3, 3)) + "<br />";
		outputStats += "<b>Best Mo3: " + pretty((bestMean3 = fastestAvgX(3))[0]) + "<br />" +  prettyPrint(printAvgX(bestMean3[1], 3)) + "</b><br />" + getPartialTimelist(bestMean3[1], 3) + "<br />";
	}		
	if (times.length > 4) {
		outputStats += "Current avg5: " + pretty(currentAvgX(5)) + "<br />" + prettyPrint(printAvgX(times.length - 5, 5)) + "<br />";
		outputStats += "<b>Best avg5: " + pretty((bestAvg5 = fastestAvgX(5))[0]) + "<br />" +  prettyPrint(printAvgX(bestAvg5[1], 5)) + "</b><br />" + getPartialTimelist(bestAvg5[1], 5) + "<br />";
	}	
	if (times.length > 11) {
		outputStats += "Current avg12: " + pretty(currentAvgX(12)) + "<br />" + prettyPrint(printAvgX(times.length - 12, 12)) + "<br />";
		outputStats += "<b>Best avg12: " + pretty((bestAvg12 = fastestAvgX(12))[0]) + "<br />" +  prettyPrint(printAvgX(bestAvg12[1], 12)) + "</b><br />" + getPartialTimelist(bestAvg12[1], 12) + "<br />";
	}	
	if (times.length > 49) {
		outputStats += "Current avg50: " + pretty(currentAvgX(50)) + "<br />" + prettyPrint(printAvgX(times.length - 50, 50)) + "<br />";
		outputStats += "<b>Best avg50: " + pretty((bestAvg50 = fastestAvgX(50))[0]) + "<br />" +  prettyPrint(printAvgX(bestAvg50[1], 50)) + "</b><br />" + getPartialTimelist(bestAvg50[1], 50) + "<br />";
	}	
	if (times.length > 99) {
		outputStats += "Current avg100: " + pretty(currentAvgX(100)) + "<br />" + prettyPrint(printAvgX(times.length - 100, 100)) + "<br />";
		outputStats += "<b>Best avg100: " + pretty((bestAvg100 = fastestAvgX(100))[0]) + "<br />" +  prettyPrint(printAvgX(bestAvg100[1], 100)) + "</b><br />" + getPartialTimelist(bestAvg100[1], 100) + "<br />";
	}
	outputStats += "<br /> --- FULL SESSION BELOW ---<br />" + getFullTimeList();
	console.log(outputStats);
	return outputStats;
}

function generateCustomStats() {
	outputStats = "** using oddTimer ** (hehe, it's a pretty awesome timer, huh?)<br /><br />";
	statistics = El("statsController").showStats
	console.log(statistics);
	forumSpoilerStart = statistics[statistics.length-2].checked ? "[spoiler]" : "<br /> --- SCRAMBLES BELOW ---<br />";
	forumSpoilerEnd = statistics[statistics.length-2].checked ? "[/spoiler]" : "";
	forumBoldStart = statistics[statistics.length-2].checked ? "[b]" : "<b>";
	forumBoldSEnd = statistics[statistics.length-2].checked ? "[/b]" : "</b>";
	showScrambles = statistics[statistics.length-4].checked ? false : true;
	showTimes = statistics[statistics.length-3].checked ? false : true;
	for (k = 0; k < statistics.length; k++) {
		if (statistics[k].checked) {
			currentSize = toInt(statistics[k].value);
			if (statistics[k].value == 0) {
				outputStats += "Best solve: " + pretty(Math.min.apply(null,times)) + " <br />";
				outputStats += "Worst solve: " + pretty(Math.max.apply(null,times)) + " <br /><br />";
			}
			if (currentSize > 4 && currentSize <= times.length) {
				console.log(currentSize);
				outputStats += "Current avg" + currentSize + ": " + pretty(currentAvgX(currentSize)) + "<br />" + (showTimes ? prettyPrint(printAvgX(times.length - currentSize, currentSize)) : "") + (showTimes ? "<br />" : "");
				console.log(currentSize);
				outputStats += forumBoldStart + "Best avg" + currentSize + ": " + pretty((bestAvgY = fastestAvgX(currentSize))[0]) + (showTimes ? "<br />" + prettyPrint(printAvgX(bestAvgY[1], currentSize)) : "") + forumBoldSEnd + "<br /><br /> ";
				console.log(currentSize);
				if (showScrambles) {
					outputStats += forumSpoilerStart + getPartialTimelist(bestAvgY[1], toInt(currentSize)) + forumSpoilerEnd + "<br />";
				}
			}
			if (currentSize == -1) {
				outputStats += "--- FULL SCRAMBLE SESSION BELOW ---<br />" + getFullTimeList();
			}
			console.log(currentSize);
		}	
	}
	El("printStatsBox").innerHTML = outputStats;
	if (statistics[statistics.length-1].checked) {
		if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(El("printStatsBox"));
            window.getSelection().addRange(range);
        }
        else if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(El("printStatsBox"));
            range.select();
        }
    }
}



/*** SCRAMBLE! ***/
function newScramble() {
	// lolololol
	scramble = "";
	El('scrambleBox').innerHTML = doScramble(localStorage.scrambleType);
}

function doScramble(puzzle) {
	scramble = "";
	switch(puzzle) {
		case "megacarrot":
			scramble = carrotscramble()
			break;
		case "222wca":
			scramble = scramble222.getScramble("222so");
			break;
		case "333wca":
			scramble = scramble333.getRandomScramble();
			break;
		case "oliverFrost":
			scramble = scramble333.getBLDScramble(10, 6);
			break;
		case "444wca":
			scramble = scramblerMega.megascramble("444wca",40);
			break;
		case "555wca":
			scramble = scramblerMega.megascramble("555wca",60);
			break;
		case "666wca":
			scramble = scramblerMega.megascramble("666wca",80);
			break;
		case "777wca":
			scramble = scramblerMega.megascramble("777wca",100);
			break;
			
		case "sq1":
			scramble = scramblesq1.getRandomScramble().replace(/,/g,"&#44;");
			break;
		case "skewb":
			scramble = scrambleSkewb.getScramble();
			break;
		case "pyrawca":
			scramble = scramblePyra.getScramble("pyrso");
			break;
		case "clockcon":
			scramble = clockscramble();
			break;
		default:
			scramble = false;
	}
	return scramble;
}

function carrotscramble() {
	var m = "-++--";
	for (i = 0; i < 7; i++){
		for (j = 0; j < 5; j++){
		  var k = 0|(Math.random()*4);
		  scramble += m.substring(k,k+2) + " ";
		}
		if(i % 2 == 0) { scramble += "&nbsp;";}
		scramble += "U" + " '"[(k / 2) | 0] + "<br />";
		if(i % 2 == 0) { scramble += "&nbsp;";}
	}
	return scramble.substring(0,scramble.length-12);
}
function clockscramble() {
	var postfix = ['UUUU','UUdU','UUdd','UdUU','UdUd','UddU','Uddd','dUUU','dUUd','dUdU','dUdd','ddUU','ddUd','dddU','dddd'];
	outputScramble = "";
	for (i = 0; i < 4; i++) {
		outputScramble += "(" + ((Math.random() * 12 | 0 ) - 5 ) + ", " + ((Math.random() * 12 - 5 ) | 0 ) + ")";
	}
	for (i = 0; i < 6; i++) {
		outputScramble += "(" + ((Math.random() * 12  | 0 ) - 5 ) + ")";
	}
	return outputScramble + " " + postfix[(Math.random() * 15) | 0];
}

function changepuzzle(newPuzzle) {
	localStorage.scrambleType = newPuzzle;
	newScramble();
}

function hideshowScramble() {
	El("scrambleSelect") == undefined ? El("scrambleSelectActive").id = "scrambleSelect" : El("scrambleSelect").id = "scrambleSelectActive";
}
function hideshowStats() {
	El("fullStatsContainer") == undefined ? El("fullStatsContainerActive").id = "fullStatsContainer" : El("fullStatsContainer").id = "fullStatsContainerActive";
	El("fullStatsContainer") == undefined ? El("printStatsBox").innerHTML = createStats(): 0 ;
}


/*** FORMAT ***/
function pretty(time) {
	hours = (time / 3600000) | 0;
	minutes = ((time % 3600000) / 60000) | 0;
	seconds = ((time % 60000) / 1000) | 0;
	ms = (((time/10) | 0) % 100);
	if (time >= 3600000) {return hours + ":" + show00(minutes) + ":" + show00(seconds) + "." + show00(ms);}
	else if (time >= 60000) {return minutes + ":" + show00(seconds) + "." + show00(ms);}
	else {return seconds + "." + show00(ms);}
}
function prettyPrint(set) {
	slowest = Math.max.apply(null,set);
	fastest = Math.min.apply(null,set);
	outputString = "<i>(";
	console.log(slowest, fastest, set);
	for (var i in set) {
		console.log(set[i]);
		j = set[i] == slowest  || set[i] == fastest? "(" + pretty(set[i]) + ")" : pretty(set[i]);
		set[i] == slowest ? slowest = -111 : set[i] == fastest ? fastest = -111 : 0;
		outputString += j + ", ";
	}
	return (outputString.substring(0,outputString.length - 2) + ")</i>");
}

function show00(num) {
	return num > 9 ? "" + num: "0" + num;
}
function ugly(num) {
	seconds = num.split(".");
	if (seconds.length == 1) {return seconds[0]*1000;}
	minutes = seconds[0].split(":");
	if (minutes.length > 1) {s = 1000*minutes[1] + 60000*minutes[0];}
	else {s = minutes[0]*1000}
	ms = seconds[1] * Math.pow(10,3-seconds[1].length);
	return s + ms
	
}
function toInt(string) {
	return string | 0
}