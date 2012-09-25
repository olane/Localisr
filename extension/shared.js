// Functions needed by the options page, background script and main content script

 // Creates an array of strings from the keys of an object
var arrayOfKeys = function(obj){
    var array = [];
    for(var key in obj){
        array.push(key);
    }
    return array;
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
