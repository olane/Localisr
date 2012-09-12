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
	zIndex: 10
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


var complete;

var init = function(){
	// debugger;
	for (var i = 0; i < complete.length; i++) {
		if(!complete[i]){ return; }
	}

	targetSymbol = acronymMap[targetCurrency] || targetCurrency + " ";
	targetTimezone = 'GMT';
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

// If the page is in a converted state then restore the original
if(Localisr.isConverted){
	Localisr.isConverted = false;
	restore('body');
}
// Otherwise convert it
else {
	Localisr.isConverted = true;
	complete = [false, false, false];

	chrome.extension.sendMessage(
		{
			method: 'getExchangeRates'
		},
		function(exchangeRates){
			money.rates = exchangeRates.data.rates;
			complete[0] = true;
			init();
		}
	);
	chrome.extension.sendMessage(
		{
			method: 'getLocalStorage',
			key: 'currency'
		},
		function(response){
			targetCurrency = response.data || 'AED';
			complete[1] = true;
			init();
		}
	);
	chrome.extension.sendMessage(
		{
			method: 'getTimezones'
		},
		function(tz){
			timezones = tz;
			var acronyms = [];
			for(var key in timezones){
				acronyms.push(key);
			}

			timezonesString = '(' + acronyms.join('|') + '){1}';
			timeString = "[0-9]{1,2}\\s*:\\s*[0-9]{2}\\s*" + timezonesString;
			timezonesRegex = new RegExp(timezonesString, 'g');
			timeRegex = new RegExp(start + timeString + end, 'g');
			timeReplaceRegex = new RegExp(timeString, 'g');
			complete[2] = true;
			init();
		}
	);
}

}());
