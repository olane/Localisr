r.string.time.separators = '(' + [':'].join('|') + '){1}';
r.regexp.time.separators = new RegExp(r.string.time.separators);

var targetTimezone;

var setupTimes = function(acronyms){
	r.string.time.timezones = '(' + acronyms.join('|') + '){1}';
	r.string.time.time = "[0-9]{1,2}" + // One or two digits
		"(\\s*" + r.string.time.separators + "\\s*[0-9]{2}\\s*)?" + // All or none of: one separator then two digits, optionally separated by whitespace
		"(\\s*am|pm)?\\s*" + // Optional AM/PM
		r.string.time.timezones; // One of the timezone acronyms

	r.regexp.time.timezones = new RegExp(r.string.time.timezones, 'gi');
	r.regexp.time.matcher = new RegExp(r.string.time.time, 'gi');
	r.regexp.time.replacer = new RegExp(r.string.time.time, 'gi');
};

var parseTimeWithMinutes = function(string, zone, separator){
	separator = separator || ':';
	var formatString, outputString, common;

	var totalOffsetString = zoneToOffsetString(zone);

	if(string.match(/am|pm/i)){
		common = 'hh' + separator + 'mm a';
	}
	else{
		common = 'HH' + separator + 'mm';
	}

	return convertTimeString(string, totalOffsetString, common);
};

var parseTime = function(string, zone){
	var formatString, outputString, common;

	var totalOffsetString = zoneToOffsetString(zone);

	if(string.match(/am|pm/i)){
		common = 'hh a';
	}
	else{
		common = 'HH';
	}
	return convertTimeString(string, totalOffsetString, common);
};

// Convert a time string to the user's target time
// Arguments:
//   - string: The time string parsed from the webpage eg. "10:32 am GMT"
//   - offset: An offset string eg. "+0500"
//   - format: The format of the time string eg. "HH mm"
var convertTimeString = function(string, offset, format){
	var parse = string.substring(0, string.length - 4) + offset;
	var time = moment(parse, format + ' Z');
	return time.format(format) + ' ' + targetTimezone;
};

// Convert a zone to an offset string
// Arguments:
//   - zone: A three letter acronym representing the timezone of the time being converted
// Returns: A string representing the difference between the offset of `zone` and the user's target timezone
var zoneToOffsetString = function(zone){
	var offsetInputTime = timezones[zone.toUpperCase()];
	var offsetTargetTime = timezones[targetTimezone];

	return offsetToString(offsetInputTime.offset - offsetTargetTime.offset);
};


// Converts something like -13.75 to "-1345" or 5 to "+0500"
var offsetToString = function(offset){
	var string = '';

	if(offset < 0){
		string += '-';
		offset *= -1;
	}
	else{
		string += '+';
	}

	if(offset < 10){
		string += '0';
	}

	string += Math.floor(offset);
	offset -= Math.floor(offset);

	if(offset > 0.01){
		var minutes = Math.round(offset * 60);

		if(minutes < 10){
			string += '0';
		}
		string += minutes;

	}
	else{
		string += '00';
	}
	return string;
};
