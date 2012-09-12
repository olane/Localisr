var timezones;
var timezonesString;
var timeString;
var timezonesRegex;
var timeRegex;
var timeReplaceRegex;

var targetTimezone;

var parseTime = function(string, zone, separator){
	var hours, minutes;
	separator = separator || ':';
	var separatorPosition = string.indexOf(separator);
	if(separatorPosition === -1){
		hours = parseInt(string, 10);
		minutes = 0;
	}
	else {
		hours = parseInt(string.substring(0, separatorPosition), 10);
		minutes = parseInt(string.substring(separatorPosition + 1, string.length), 10);
	}

	// debugger;
	return convertTime(hours, minutes, zone);
};

var convertTime = function(hours24, minutes, zone, date){
	var rightNow = new Date();
	var hasDate;
	if(date){
		hasDate = true;
	}
	else{
		hasDate = false;
		date = {};
	}

	var defaults = {
		year: rightNow.getFullYear(),
		month: rightNow.getMonth(),
		dayOfMonth: rightNow.getDate()
	};

	$.extend(date, defaults);

	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	// Get a date object for the input time/date as UTC
	var inputTimeUTCString = months[date.month] + " " + date.dayOfMonth + ", " + date.year + " " + hours24 + ":" + minutes + " " + zone;
	var inputTimeDate = new Date(inputTimeUTCString);


	// get a date object for midnight today in this timezone
	var thisZone = new Date(rightNow.getFullYear(), rightNow.getMonth(), rightNow.getDate(), 0, 0, 0, 0);
	// get that time as a UTC string
	var thisZoneUTCString = thisZone.toUTCString();
	// get a new date object for the UTC time, but in this timezone
	var UTCZone = new Date(thisZoneUTCString.substring(0, thisZoneUTCString.lastIndexOf(" ") - 1));
	// difference between date objects will be the offset from UTC in this timezone (this time zone = UTC + -offset)
	var time_offset = (thisZone - UTCZone) / (1000 * 60 * 60);

	// add offset to input time (UTC version)
	inputTimeDate.setTime(inputTimeDate.getTime() + time_offset * 60 * 60 * 1000);

	// remove timezone from time with added offset
	var newDateString = inputTimeDate.toUTCString().substring(0, inputTimeDate.toUTCString().lastIndexOf(" ") - 3);
	// make a final object with the converted time in
	var newDate = new Date(newDateString);

	if(newDate.toString() === 'Invalid Date'){
		console.log('Unsupported time zone');
		// TODO: manually convert unsupported time zones using zones.json
		return null;
	}

	var s = newDate.toTimeString();
	var finalString = s.substring(0, 5) + ' ' + s.substring(s.length - 4, s.length - 1);
	if(hasDate){
		finalString += ', ' + newDate.toDateString();
	}
	return finalString;
};
