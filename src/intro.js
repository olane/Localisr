(function(){

// Set up a global object to store persistent properties
window.Localisr = window.Localisr || {};

var timezones;

var acronyms = ['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYR', 'BZD', 'CAD', 'CDF', 'CHF', 'CLF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'STD', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMK', 'ZWL'];
var symbols = ['£', '€', '¥', '$'];
var currencies = [];
var i;

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

var basePriceRegex = "[0-9]+\\.?([0-9]{2})?";

// Characters used for both matching and replacing
var types = "(" + currencies.join('|') + "){1}";
var commonString = types + "\\s*" + basePriceRegex;

var start = "(^|\\s)+";
var end = "($|\\s)+";

// Regex used for determining whether there is a price in a string
var matchRegex = new RegExp(start + commonString + end, 'g');
// Regex for replacing the price in the string
var replaceRegex = new RegExp(commonString, 'g');
var typeRegex = new RegExp(types, 'g');

var timezonesString;
var timeString;
var timezonesRegex;
var timeRegex;
var timeReplaceRegex;

var targetCurrency, targetTimezone, targetSymbol;


var invert = function(obj){
	var new_obj = {};

	for (var prop in obj){
		if(obj.hasOwnProperty(prop)){
			new_obj[obj[prop]] = prop;
		}
	}

	return new_obj;
};

var symbolMap = {
	'£': 'GBP',
	'$': 'USD',
	'€': 'EUR',
	'¥': 'JPY'
};

var acronymMap = invert(symbolMap);
