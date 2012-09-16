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
	var offset = timezones[zone];

	// debugger;

	if(string.match(/am|pm/i)){
		common = 'hh' + separator + 'mm a';
	}
	else{
		common = 'HH' + separator + 'mm';
	}
	outputString = common;
	formatString = common + ' Z';

	var parseString = string.substring(0, string.length - 4) + offset.string;
	var time = moment(parseString, formatString);
	var diff = offset - timezones[targetTimezone];
	time.add('hours', diff);
	return time.format(outputString) + ' ' + targetTimezone;
};
