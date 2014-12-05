var Utils = {};

Utils.Timer = function(cfg) {

	var root = this;
	var clock,
		controls = cfg.controls || true,
		container = cfg.container || "body",
		name = cfg.name || "defaultTimer",
		countdown = cfg.countdown || true,
		totalTime = cfg.totalTime || 60,
		isOn = cfg.isOn || false,
		startFrom = (countdown)? totalTime : 0,
		currentTime = startFrom;
	
	function getHumanTime(val) {
		val = val * 1000;
		var hour = (val/1000/60/60) << 0,
			min = ((val/1000/60) % 60),
			sec = (val/1000) % 60,
			hour = (hour>9)? hour : '0' + hour,
			min = (min>9)? min : '0' + min,
			sec = (sec>9)? sec : '0' + sec;
		return (hour + ':' + min + ':' + sec);
	}

	function tik() {
		if(countdown && currentTime != 0){
			updateClock(getHumanTime(currentTime--));
		}
		else if(!countdown && currentTime != totalTime+1) {
			updateClock(getHumanTime(currentTime++));
		}
		else {
			updateClock(getHumanTime(0));
			stop();
		}
	}
	
	function updateClock(val) {
		$tableau.text(val);
	}
	
	function start() {
		if(!isOn){
			if(currentTime === startFrom) setTimeout(tik, 1000);
			clock = setInterval(tik, 1000);
			isOn = true;
			if(controls) $('.play', $htmlRoot).removeClass("play").addClass("stop");
		}
	}

	function stop() {
		if(isOn){
			clearInterval(clock);
			isOn = false;
			if(controls) $('.stop', $htmlRoot).removeClass("stop").addClass("play");
		}
	}

	function reset() {
		startFrom = (countdown)? totalTime : 0;
		currentTime = startFrom;
		stop();
		updateClock(getHumanTime(startFrom));
	}

	function getCurrentTime() {
		return currentTime;
	}

	function getTotalTime() {
		return totalTime;
	}

	function setTimeTo(val) {
		currentTime = val;
		updateClock(getHumanTime(currentTime));
	}
	
	function setTotalTimeTo(val) {
		totalTime = val;
		reset();
	}
	
	function wireControls(){
		$($htmlRoot).on("click", ".play", function(){
			start.call();
		});
		$($htmlRoot).on("click", ".stop", function(){
			stop.call();
		});
		$($htmlRoot).on("click", ".reset", function(){
			reset.call();
		});
	}
	
	$("body").append( '<div id="' + name + '" class="timer"><span class="digits">' + getHumanTime(currentTime) + '</span></div>' );
	var $htmlRoot = $('#' + name);
	var $tableau = $('.digits', $htmlRoot);
	if(controls){
		$tableau.before('<span class="controls button reset"></span>');
		$tableau.after('<span class="controls button play"></span>');
		wireControls();
	}
	
	return {
		start: start,
		stop: stop,
		reset: reset,
		getCurrentTime: getCurrentTime,
		getTotalTime: getTotalTime,
		setTotalTimeTo: setTotalTimeTo,
		setTimeTo: setTimeTo
    };
};
