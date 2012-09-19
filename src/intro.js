(function(){

// Regular expressions
var r = {
	// Common snippets used in many regular expressions
	base: {
		start : "(^|\\s)+",
		end : "($|\\s)+"
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

var invert = function(obj){
	var new_obj = {};

	for (var prop in obj){
		if(obj.hasOwnProperty(prop)){
			new_obj[obj[prop]] = prop;
		}
	}

	return new_obj;
};

var hoverStyle = {
	position: 'absolute',
	left: 0,
	background: '#eee',
	border: '1px solid #222',
	padding: '5px',
	display: 'none',
	zIndex: 9999
};

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
