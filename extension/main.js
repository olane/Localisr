(function(){
    var currencies = ['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYR', 'BZD', 'CAD', 'CDF', 'CHF', 'CLF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'STD', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMK', 'ZWL'];

	var targetCurrency, targetTimezone, targetSymbol;

	var CurrencyTypes = {
		NOT: 0,
		NORMAL: 1,
		THOUSAND: 2,
		MILLION: 3,
		BILLION: 4,
		TRILLION: 5
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

	var basePriceRegex = "[0-9]+\\.?([0-9]{2})?";
	var currencyRegex = new RegExp("^(£|\\$|€|¥){1}" + basePriceRegex + "$");

	var symbolMap = {
		'£': 'GBP',
		'$': 'USD',
		'€': 'EUR',
		'¥': 'JPY'
	};

	var acronymMap = invert(symbolMap);

	var isTime = function(s){
		return s.match(/^[0-9]{1,2}:[0-9]{2}$/);
	};

	var getCurrencyType = function(s){
		if(s.match(currencyRegex)){
			return CurrencyTypes.NORMAL;
		}
		// if(s.match(/^(£|\$|€|¥){1}[0-9]+\.?([0-9]+)?\s+m(illion)?$/)){
		// 	return CurrencyTypes.MILLION;
		// }

		return CurrencyTypes.NOT;
	};

	var convertPrice = function(string, acronym){
		var symbol = acronymMap[acronym];
		if(acronym === undefined){
			symbol = acronym + ' ';
		}

		var price = accounting.unformat(string);
		var newPrice = fx.convert(price, {from: acronym, to: targetCurrency});
		var newPriceString = accounting.formatMoney(newPrice, targetSymbol, 2);
		// console.log(price);
		return newPriceString;
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

	var generateCurrencyReplacement = function(oldPrice, newPrice){
		var hover = $('<span>')
			.addClass('converted-price-hover')
			.css(hoverStyle)
			.text("Original price: " + oldPrice);

		var wrapper = $('<span>')
			.text(newPrice)
			.addClass('converted-price')
			.css('position', 'relative')
			.append(hover);

		return $('<div>').html(wrapper).html();
	};

	// Parse a string to see if it is a simple currency string like £100.32
	// Replace it with a converted version if it is
	var parseCurrency = function(s){
		var currencyType = getCurrencyType(s);

		if(currencyType !== CurrencyTypes.NOT){
			var oldPrice = s;
			var newPrice = convertPrice(oldPrice, symbolMap[oldPrice[0]]);

			if(newPrice !== null){
				return generateCurrencyReplacement(oldPrice, newPrice);
			}
		}
		return null;
	};

	var scan = function(element){
		// debugger;
		$(element).contents().each(function(index){
			if(this.nodeType === 3){
				// The node is a text node so it can be parsed for currencies
				var text = this.textContent;

				// First scan each word in the text node for simple currencies like £120
				var words = text.split(' ');
				var containsCurrency = false;

				for(var i = 0; i < words.length; i++){
					var replacement = parseCurrency(words[i]);
					if(replacement !== null){
						words[i] = replacement;
						containsCurrency = true;
					}
				}

				if(containsCurrency){
					var t = $(this);
					t.parent().append(words.join(' '));
					t.remove();
				}

				// Then scan the whole string for more complex strings that could be a currency
				for(i = 0; i < currencies.length; i++){
					var currency = currencies[i];
					var regex = new RegExp(currency + "\\s*" + basePriceRegex);

					if(text.match(regex)){
						// Extract a string containing just the price from the text
						var oldPrice = text.match(regex)[0];
						// Extract a string containing just the acronym from the text
						var acronym = text.match(new RegExp(currency, ['g']))[0];
						// Convert them to the user's currency
						var newPrice = convertPrice(oldPrice, acronym);

						// Replace the old price string with the new one
						var html = text.replace(regex, generateCurrencyReplacement(oldPrice, newPrice));
						$(this).after($('<span>').html(html)).remove();
					}
				}
			}
			else if(this.nodeType === 1 && this.nodeName.toLowerCase() !== 'iframe'){
				// The node is a normal element so recursively scan it for more text nodes
				scan(this);
			}
		});
	};

	var complete = [false, false];

	var init = function(){
		// debugger;
		for (var i = 0; i < complete.length; i++) {
			if(!complete[i]){ return; }
		}

		targetSymbol = acronymMap[targetCurrency];
		targetTimezone = 'GMT';
		fx.base = 'USD';

		scan('body');

		$('.converted-price')
			.on('mouseenter', function(){
				$(this).find('.converted-price-hover').show();
			})
			.on('mouseout', function(){
				$(this).find('.converted-price-hover').hide();
			});

		$('.converted-price-hover').each(function(){
			var t = $(this);
			t.css('bottom', -(t.height() + 10));
		});
	};

	chrome.extension.sendMessage(
		{
			method: 'getExchangeRates'
		},
		function(exchangeRates){
			// debugger;
			fx.rates = exchangeRates.data.rates;
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
			// debugger;
			targetCurrency = response.data;
			complete[1] = true;
			init();
		}
	);

}());
