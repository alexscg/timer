var Utils = {};

Utils.Timer = function() {

	var root = this;
	var clock;
	this.controls = true;
  this.container = "body";
	this.name = "defaultTimer";
	this.countdown = true;
  this.totalTime = 60;
	this.isOn = false;
	
	for(var prop in arguments[0]) {
		if(this.hasOwnProperty(prop)) {
			this[prop] = arguments[0][prop];
		}
	}
	this.startFrom = (this.countdown)? this.totalTime : 0;
	this.currentTime = this.startFrom;
	
	function getHumanTime(val) {
		val = val * 1000;
		var hour = (val/1000/60/60) << 0,
		    min = (val/1000/60) << 0,
		    sec = (val/1000) % 60,
		    hour = (hour>9)? hour : '0' + hour,
		    min = (min>9)? min : '0' + min,
		    sec = (sec>9)? sec : '0' + sec;
		return (hour + ':' + min + ':' + sec);
	}

	function tik() {
		if(root.countdown && root.currentTime != 0){
			updateClock(getHumanTime(root.currentTime--));
		}
		else if(!root.countdown && root.currentTime != root.totalTime+1) {
			updateClock(getHumanTime(root.currentTime++));
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
		if(!root.isOn){
			if(root.currentTime === root.startFrom) setTimeout(tik, 1000);
			clock = setInterval(tik, 1000);
			root.isOn = true;
			if(root.controls) $('.play', $htmlRoot).removeClass("play").addClass("stop");
		}
  }

  function stop() {
		if(root.isOn){
			clearInterval(clock);
			root.isOn = false;
			if(root.controls) $('.stop', $htmlRoot).removeClass("stop").addClass("play");
		}
  }

  function reset() {
		root.startFrom = (root.countdown)? root.totalTime : 0;
		root.currentTime = root.startFrom;
		stop();
		updateClock(getHumanTime(root.startFrom));
  }

  function getCurrentTime() {
		return root.currentTime;
  }

  function getTotalTime() {
		return root.totalTime;
  }

	function setTimeTo(val) {
		root.currentTime = val;
		updateClock(getHumanTime(root.currentTime));
  }
	
  function setTotalTimeTo(val) {
		root.totalTime = val;
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
	
	$("body").append( '<div id="' + this.name + '" class="snitimer"><span class="digits">' + getHumanTime(root.currentTime) + '</span></div>' );
	var $htmlRoot = $('#' + root.name);
	var $tableau = $('.digits', $htmlRoot);
	if(root.controls){
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
