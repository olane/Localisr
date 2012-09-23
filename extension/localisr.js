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

var targetCurrency, targetSymbol, currencyAcronyms;

var symbols = ['£', '€', '¥', '$'];
var currencies = [];

money.base = 'USD';

var setupCurrencies = function(acronyms){
	var i = 0;
	currencyAcronyms = acronyms;
	// Set up currencies list using acronyms and symbols.
	for(i = 0; i < acronyms.length; i++){
		currencies.push(acronyms[i]);
	}
	for(i = 0; i < symbols.length; i++){
		var symbol = symbols[i];
		// "$" is a metacharacter in regular expressions, so escape it
		if(symbol === '$'){
			symbol = '\\$';
		}
		currencies.push(symbol);
	}

	r.base.price = "[0-9]+\\.?([0-9]{2})?";
	// Characters used for both matching and replacing
	r.string.price.currencies = "(" + currencies.join('|') + "){1}";
	var commonString = r.string.price.currencies + "\\s*" + r.base.price;

	// Regex used for determining whether there is a price in a string
	r.regexp.price.matcher = new RegExp(commonString, 'gi');
	// Regex for replacing the price in the string
	r.regexp.price.replacer = new RegExp(commonString, 'g');
	r.regexp.price.currencies = new RegExp(r.string.price.currencies, 'g');
};

var symbolMap = {
	'£': 'GBP',
	'$': 'USD',
	'€': 'EUR',
	'¥': 'JPY'
};

var acronymMap = invert(symbolMap);


// Arguments:
//   - string: A string representing a foreign price, eg. £123.45
//   - currency: A string representing a currency, either a symbol like £ or a three letter acronym like GBP
// Returns: A string representing the price in the user's target currency.
var convertPrice = function(string, currency){
	var acronym;
	// Convert symbol to acronym if that was what was passed
	if(currencyAcronyms.indexOf(currency) !== -1){
		acronym = currency;
	}
	else if(symbols.indexOf(currency) !== -1){
		acronym = symbolMap[currency];
	}
	else{
		throw new Error("Invalid currency string: " + currency);
	}

	var price = accounting.unformat(string);
	var newPrice = money.convert(price, {from: acronym, to: targetCurrency});
	var newPriceString = accounting.formatMoney(newPrice, targetSymbol, 2);

	return newPriceString;
};

var converters = [
	// Price converter
	function(text, matches, replacements){
		for(var i = 0; i < matches.length; i++){
			var oldPrice = matches[i];
			if(oldPrice){
				var currency = oldPrice.match(r.regexp.price.currencies)[0];
				// Convert them to the user's currency
				var newPrice = convertPrice(oldPrice, currency);

				// Replace the old price string with the new one
				text = text.replace(replacements[i], generateReplacement(oldPrice, newPrice, 'price'));
			}
		}

		return text;
	},

	// Time converter
	function(text, matches, replacements){
		// Loop through the array of matched times to convert them
		for(var i = 0; i < matches.length; i++){
			// Store the original time
			var oldTime = matches[i];

			// string.match() sometimes returns empty strings or undefined, so ignore these
			if(oldTime){
				// Extract just the timezone acronym from the time string
				var timezone = oldTime.match(r.regexp.time.timezones)[0];
				// Don't convert values that are already in the user's target timezone
				if(timezone.toUpperCase() === targetTimezone){ continue; }

				var newTime;
				// If the time string matched the regex and has a separator character in it, it must also have minutes
				if(oldTime.match(r.regexp.time.separators)){
					newTime = parseTimeWithMinutes(oldTime, timezone);
				}
				// Otherwise it's just got hours
				else{
					newTime = parseTime(oldTime, timezone);
				}

				// Don't perform the replacement if the conversion failed
				if(newTime !== null){
					// Replace the current occurence of a time in the text node with a html string replacement for the converted time and popup box
					text = text.replace(replacements[i], generateReplacement(oldTime, newTime, 'time'));
				}
			}
		}

		return text;
	}
];

// Converts any price and time strings in any text nodes in the element, then recursively converts any child elements
var convert = function(element){
	$(element).contents().each(function(index){
		if(this.nodeType === 3){
			// The node is a text node so it can be parsed for currencies
			var text = this.textContent;
			var oldText = text;

			for(var i = 0; i < 2; i++){
				var matcher = [r.regexp.price.matcher, r.regexp.time.matcher][i];
				var replacer = [r.regexp.price.replacer, r.regexp.time.replacer][i];

				// Get an array of every substring in the current text node that is a valid price or time
				var matches = text.match(matcher);

				// If there are any matches
				if(matches){
					// Get an array of substrings from the current text node to replace with the converted value
					// This is the same as the array of matches but without trailing / leading whitespace so whitespace doesn't get replaced
					var replacements = text.match(replacer);

					text = converters[i](text, matches, replacements);
				}
			}

			// If any replacements have been made, replace the text node with a span element containing the converted text
			if(text !== oldText){
				var replacement = $('<span>')
					.attr('data-original-text', oldText)
					.html(text);

				$(this).replaceWith(replacement);
			}
		}

		else if(this.nodeType === 1 && this.nodeName.toLowerCase() !== 'iframe'){
			// The node is a normal element so recursively scan it for more text nodes
			convert(this);
		}
	});
};


// Recursively restores an element and all its children to previous values after conversion
var restore = function(element){
	// Loop through all child nodes of the element
	$(element).contents().each(function(index){
		var nodeName = this.nodeName.toLowerCase();
		// If the node is a DOM element (not a text node) and not an iframe (due to cross-domain security restrictions)
		if(this.nodeType === 1 && nodeName !== 'iframe'){

			// If the node is a span node
			if(nodeName === 'span'){
				var t = $(this);
				var originalText = t.attr('data-original-text');

				// and is a converted time or price
				if(originalText){
					// Replace the span node with a text node contaning the original text from before the conversion
					var replacement = document.createTextNode(originalText);
					t.replaceWith(replacement);
					return;
				}
			}

			// Otherwise call recursively to restore any children of this node to their original state
			restore(this);
		}
	});
};

var init = function(){
	setupCurrencies(arrayOfKeys(money.rates));
	setupTimes(arrayOfKeys(timezones));

	// If the user's target currency has a symbol then use it, otherwise use the acronym as the symbol
	targetSymbol = acronymMap[targetCurrency] || targetCurrency + ' ';

	// Convert all the times and prices on the page
	convert('body');

	// Bind the mouse events for the 'original value' popups
	$('.converted-value')
		.on('mouseenter', function(){
			$(this).find('.converted-value-hover').show();
		})
		.on('mouseout', function(){
			$(this).find('.converted-value-hover').hide();
		});

	// Set the position of the popups
	$('.converted-value-hover').each(function(){
		var t = $(this);
		t.css('bottom', -(t.height() + 10));
	});
};

// Triggered when a message is sent from the background script containing the data needed to convert the page
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse){
		if(request.method === 'run'){
			// If the page is in a converted state then restore the original
			if(request.isConverted){
				restore('body');
			}
			// Otherwise convert it
			else {
				money.rates = request.rates;
				targetCurrency = request.currency || 'AED';
				targetTimezone = request.timezone || 'UTC';
				timezones = request.timezones;

				init();
			}
		}
	}
);

// Check if the current page's URL matches the user's list of URLs on which the extension should automatically run
chrome.extension.sendMessage({method: 'getAutoRunURLs'}, function(urls){
	if(!urls){ return; }
	urls = urls.split('\n');

	for(var i = 0; i < urls.length; i++){
		var url = urls[i];
		// If it matches, send a request to the background script to pass the necessary data to convert the page
		if(url && window.location.href.match(new RegExp(url))){
			chrome.extension.sendMessage({method: 'runScript'});
			return;
		}
	}
});

