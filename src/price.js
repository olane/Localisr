var targetCurrency, targetSymbol;

var acronyms = 'AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTN,BWP,BYR,BZD,CAD,CDF,CHF,CLF,CLP,CNY,COP,CRC,CUP,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ETB,EUR,FJD,FKP,GBP,GEL,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,INR,IQD,IRR,ISK,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KZT,LAK,LBP,LKR,LRD,LSL,LTL,LVL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRO,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLL,SOS,SRD,STD,SVC,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VND,VUV,WST,XAF,XCD,XDR,XOF,XPF,YER,ZAR,ZMK,ZWL'.split(',');
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

r.base.price = "[0-9]+\\.?([0-9]{2})?";
// Characters used for both matching and replacing
r.string.price.currencies = "(" + currencies.join('|') + "){1}";
var commonString = r.string.price.currencies + "\\s*" + r.base.price;

// Regex used for determining whether there is a price in a string
r.regexp.price.matcher = new RegExp(r.base.start + commonString + r.base.end, 'g');
// Regex for replacing the price in the string
r.regexp.price.replacer = new RegExp(commonString, 'g');
r.regexp.price.currencies = new RegExp(r.string.price.currencies, 'g');

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
	if(acronyms.indexOf(currency) !== -1){
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
