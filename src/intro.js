// Regular expressions
var r = {
	// Common snippets used in many regular expressions
	base: {
		start : "(?=\\s)",
		end : "(?=\\s)"
	},
	// RegExp objects
	regexp: {
		time: {},
		price: {}
	},
	// String versions
	string: {
		time: {},
		price: {}
	}
};

// Returns: A new object with the keys and values of the input object swapped
var invert = function(obj){
	var new_obj = {};

	for (var prop in obj){
		if(obj.hasOwnProperty(prop)){
			new_obj[obj[prop]] = prop;
		}
	}

	return new_obj;
};

// Returns: An array of strings from the keys of the input object
var arrayOfKeys = function(obj){
	var array = [];
	for(var key in obj){
		array.push(key);
	}
	return array;
};

// The CSS styles for the boxes that show the original value on mouseover
var hoverStyle = {
	position: 'absolute',
	left: 0,
	background: '#eee',
	border: '1px solid #222',
	padding: '5px',
	display: 'none',
	zIndex: 9999
};

// Creates an html string to replace a converted value with
// Arguments:
//   - oldValue: The string that will be replaced eg. "£100"
//   - newValue: The converted form of oldValue eg. "$130"
//   - type: A string describing the type of value being converted eg. "price"
// Returns: A string of html containing the markup for the replacement value and the popup to display the original value
var generateReplacement = function(oldValue, newValue, type){
	var hover = $('<span>')
		.addClass('converted-value-hover')
		.css(hoverStyle)
		.text('Original ' + type + ': ' + oldValue);

	var wrapper = $('<span>')
		.text(newValue)
		.addClass('converted-value')
		.css('position', 'relative')
		.append(hover);

	return $('<div>').html(wrapper).html();
};
