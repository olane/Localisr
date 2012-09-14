var timezones;
var timezonesString;
var timeString;
var timezonesRegex;
var timeRegex;
var timeReplaceRegex;

var targetTimezone;

var parseTime = function(string, zone, separator){
	separator = separator || ':';
	var formatString, outputString, common;
	var offsetInputTime = timezones[zone];
	var offsetTargetTime = timezones[targetTimezone];

	var totalOffset = offsetInputTime.offset - offsetTargetTime.offset;
	var totalOffsetString = offsetToString(totalOffset);

	// debugger;

	if(string.match(/am|pm/i)){
		common = 'hh' + separator + 'mm a';
	}
	else{
		common = 'HH' + separator + 'mm';
	}
	outputString = common;
	formatString = common + ' Z';

	var parseString = string.substring(0, string.length - 4) + totalOffsetString;
	var time = moment(parseString, formatString);
	time.local();
	return time.format(outputString) + ' ' + targetTimezone;
};


// Converts something like -13.75 to "-1345" or 5 to "+0500"
var offsetToString = function(offset){
	console.log(offset);

	var string = "";

	if(offset < 0){
		string += "-";
		offset *= -1;
	}
	else{
		string += "+";
	}

	if(offset < 10){
		string += "0";
	}

	string += Math.floor(offset);
	offset -= Math.floor(offset);

	if(offset > 0.01){
		var minutes = Math.round(offset * 60);

		if(minutes < 10){
			string += "0";
			string += minutes;
		}
		else{
			string += minutes;
		}
	}
	else{
		string += "00";
	}
	console.log(string);
	return string;
};