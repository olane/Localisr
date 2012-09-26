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

	r.string.price.price = "[0-9]+\\.?([0-9]{2})?";

	r.string.price.currencies = matchOneRegex(currencies);
	r.string.price.symbols = matchOneRegex(symbols);
	r.string.price.acronyms = matchOneRegex(acronyms);

	r.string.price.matchers = [
		r.string.price.currencies + "\\s*" + r.string.price.price,
		r.string.price.symbols + "\\s*" + r.string.price.price + "\\s*" + r.string.price.acronyms
	];

	// Regex used for determining whether there is a price in a string
	r.regexp.price.matchers = [
		new RegExp(r.string.price.matchers[0], 'gi'),
		new RegExp(r.string.price.matchers[1], 'gi')
	];
	r.regexp.price.currencies = new RegExp(r.string.price.currencies, 'gi');
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
