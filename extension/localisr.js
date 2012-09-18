(function(){

// Set up a global object to store persistent properties
window.Localisr = window.Localisr || {};

// Regexes for the beginning and end of a price or time
var start = "(^|\\s)+";
var end = "($|\\s)+";

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
	// var diff = offset - timezones[targetTimezone];
	// time.add('hours', diff);
	return time.format(outputString) + ' ' + targetTimezone;
};


// Converts something like -13.75 to "-1345" or 5 to "+0500"
var offsetToString = function(offset){
	// console.log(offset);

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
	// console.log(string);
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
var matchRegex = new RegExp(start + commonString + end, 'g');
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
	// debugger;
	$(element).contents().each(function(index){
		if(this.nodeType === 3){
			// The node is a text node so it can be parsed for currencies
			var text = this.textContent;
			var oldText = text;

			var containsCurrency = false;
			var matches = text.match(matchRegex);
			var typeMatches = text.match(typeRegex);

			var replacements, i;

			if(matches && typeMatches){
				replacements = text.match(replaceRegex);

				for(i = 0; i < matches.length; i++){
					// debugger;
					if(!(matches[i] && typeMatches[i])){ break; }
					containsCurrency = true;

					// Extract a string containing just the numerical price from the text
					var oldPrice = matches[i];

					var type = typeMatches[i];
					// Convert them to the user's currency
					var newPrice = convertPrice(oldPrice, type);

					// Replace the old price string with the new one
					text = text.replace(replacements[i], generateReplacement(oldPrice, newPrice, 'price'));
				}
			}

			var containsTimes = false;
			var timeMatches = text.match(timeRegex);

			if(timeMatches){
				replacements = text.match(timeReplaceRegex);
				var tz = text.match(timezonesRegex);
				// debugger;
				for(i = 0; i < timeMatches.length; i++){
					if(!timeMatches[i]){ break; }
					containsTimes = true;

					var oldTime = timeMatches[i];
					var newTime = parseTime(oldTime, tz[i]);
					if(newTime !== null){
						text = text.replace(replacements[i], generateReplacement(oldTime, newTime, 'time'));
					}
				}
			}

			// If any replacements have been made, replace the text node with a span element containing the converted text
			if(containsCurrency || containsTimes){
				var replacement = $('<span>');
				replacement.attr('data-original-text', oldText);
				replacement.html(text);
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
	timeString = "[0-9]{1,2}\\s*:\\s*[0-9]{2}\\s*((am)|(pm))?\\s*" + timezonesString;
	timezonesRegex = new RegExp(timezonesString, 'g');
	timeRegex = new RegExp(start + timeString + end, 'gi');
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
	console.log(urls);
	// debugger;

	for(var i = 0; i < urls.length; i++){
		var url = urls[i];
		if(url && window.location.href.match(new RegExp(url))){
			chrome.extension.sendMessage({method: 'runScript'});
			return;
		}
	}
});

}());
