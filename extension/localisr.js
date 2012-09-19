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

var timezones;
var timezonesString;
var timeString;
var timezonesRegex;
var timeRegex;
var timeReplaceRegex;

r.string.time.separators = '(' + [':'].join('|') + '){1}';
r.regexp.time.separators = new RegExp(r.string.time.separators);

var targetTimezone;

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

var targetCurrency, targetSymbol;

var acronyms = ['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYR', 'BZD', 'CAD', 'CDF', 'CHF', 'CLF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'STD', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMK', 'ZWL'];
var symbols = ['£', '€', '¥', '$'];
var currencies = [];
var i;

var basePriceRegex = "[0-9]+\\.?([0-9]{2})?";

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

// Characters used for both matching and replacing
var types = "(" + currencies.join('|') + "){1}";
var commonString = types + "\\s*" + basePriceRegex;

// Regex used for determining whether there is a price in a string
var matchRegex = new RegExp(r.base.start + commonString + r.base.end, 'g');
// Regex for replacing the price in the string
var replaceRegex = new RegExp(commonString, 'g');
var typeRegex = new RegExp(types, 'g');

var symbolMap = {
	'£': 'GBP',
	'$': 'USD',
	'€': 'EUR',
	'¥': 'JPY'
};

var acronymMap = invert(symbolMap);


// Takes a string representing a foreign price, and a type for the foreign currency,
// and returns a string representing the price in the user's target currency.
var convertPrice = function(string, type){
	var acronym;
	// Convert symbol to acronym if that was what was passed
	if(acronyms.indexOf(type) !== -1){
		acronym = type;
	}
	else if(symbols.indexOf(type) !== -1){
		acronym = symbolMap[type];
	}
	else{
		throw new Error("Invalid currency type " + type);
	}

	var price = accounting.unformat(string);
	var newPrice = money.convert(price, {from: acronym, to: targetCurrency});
	var newPriceString = accounting.formatMoney(newPrice, targetSymbol, 2);

	return newPriceString;
};

// Recursively scans an element and all of its children, and tries to convert the times and prices
// in all the text nodes.
var scan = function(element){
	$(element).contents().each(function(index){
		if(this.nodeType === 3){
			// The node is a text node so it can be parsed for currencies
			var text = this.textContent;
			var oldText = text;

			var replaced = false;
			var matches = text.match(matchRegex);
			var typeMatches = text.match(typeRegex);

			var replacements, i;

			if(matches && typeMatches){
				replacements = text.match(replaceRegex);

				for(i = 0; i < matches.length; i++){
					if(!(matches[i] && typeMatches[i])){ break; }
					replaced = true;

					// Extract a string containing just the numerical price from the text
					var oldPrice = matches[i];

					var type = typeMatches[i];
					// Convert them to the user's currency
					var newPrice = convertPrice(oldPrice, type);

					// Replace the old price string with the new one
					text = text.replace(replacements[i], generateReplacement(oldPrice, newPrice, 'price'));
				}
			}

			var timeMatches = text.match(timeRegex);

			if(timeMatches){
				replacements = text.match(timeReplaceRegex);
				var tz = text.match(timezonesRegex);

				for(i = 0; i < timeMatches.length; i++){
					if(!timeMatches[i]){ break; }

					var oldTime = timeMatches[i];
					var newTime;
					if(oldTime.match(r.regexp.time.separators)){
						newTime = parseTimeWithMinutes(oldTime, tz[i]);
					}
					else{
						// debugger;
						newTime = parseTime(oldTime, tz[i]);
					}

					if(newTime !== null){
						text = text.replace(replacements[i], generateReplacement(oldTime, newTime, 'time'));
						replaced = true;
					}
				}
			}

			// If any replacements have been made, replace the text node with a span element containing the converted text
			if(replaced){
				var replacement = $('<span>')
					.attr('data-original-text', oldText)
					.html(text);

				$(this).replaceWith(replacement);
			}
		}

		else if(this.nodeType === 1 && this.nodeName.toLowerCase() !== 'iframe'){
			// The node is a normal element so recursively scan it for more text nodes
			scan(this);
		}
	});
};


// Recursively restores an element and all its children to previous values after conversion
var restore = function(element){
	$(element).contents().each(function(index){
		if(this.nodeType === 1 && this.nodeName.toLowerCase() !== 'iframe'){
			if(this.nodeName.toLowerCase() === 'span'){
				var t = $(this);
				var originalText = t.attr('data-original-text');
				if(originalText){
					var replacement = document.createTextNode(originalText);
					$(this).replaceWith(replacement);
					return;
				}
			}

			restore(this);
		}
	});
};

var init = function(){
	var acronyms = [];
	for(var key in timezones){
		acronyms.push(key);
	}

	timezonesString = '(' + acronyms.join('|') + '){1}';
	timeString = "[0-9]{1,2}" + // One or two digits
		"(\\s*" + r.string.time.separators + "\\s*[0-9]{2}\\s*)?" + // All or none of: one separator then two digits, optionally separated by whitespace
		"((am)|(pm))?\\s*" + // Optional AM/PM
		timezonesString; // One of the timezone acronyms

	timezonesRegex = new RegExp(timezonesString, 'gi');
	timeRegex = new RegExp(r.base.start + timeString + r.base.end, 'gi');
	timeReplaceRegex = new RegExp(timeString, 'gi');

	targetSymbol = acronymMap[targetCurrency] || targetCurrency + ' ';
	money.base = 'USD';

	scan('body');

	$('.converted-value')
		.on('mouseenter', function(){
			$(this).find('.converted-value-hover').show();
		})
		.on('mouseout', function(){
			$(this).find('.converted-value-hover').hide();
		});

	$('.converted-value-hover').each(function(){
		var t = $(this);
		t.css('bottom', -(t.height() + 10));
	});
};

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

chrome.extension.sendMessage({method: 'getAutoRunURLs'}, function(urls){
	if(!urls){ return; }
	urls = urls.split('\n');

	for(var i = 0; i < urls.length; i++){
		var url = urls[i];
		if(url && window.location.href.match(new RegExp(url))){
			chrome.extension.sendMessage({method: 'runScript'});
			return;
		}
	}
});

}());
