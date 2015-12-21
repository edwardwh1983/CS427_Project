define(function(){
	function getBuildDuration(build,callback){
		if (typeof remoteAction == "undefined"){
			throw "No remoteAction object. Are you running from tests?";
		}
		if (typeof $j == "undefined"){
			throw "No $j object. Are you running from tests?";
		}
		remoteAction.getBuildDuration(build, $j.proxy(function(e){
			if (callback)
				callback(parseInt(e.responseJSON));
		}));
	}
	function durationString(duration){
		if (!duration || duration < 0)
			duration = 0;
		var levels = [[1,"ms"],[1000,"s"],[1000*60,"min"],[1000*60*60,"hr"]];
		for (var i = 1; i < levels.length; i++){
			if (levels[i][0] > duration){
				break;
			}
		}
		var size = levels[i-1][0];
		var ending = levels[i-1][1];
		return Math.round(10*duration/size)/10 + " " + ending;
	}
	return {
		getBuildDuration: getBuildDuration,
		durationString: durationString
	}
});