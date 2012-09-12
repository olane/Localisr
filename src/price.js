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
