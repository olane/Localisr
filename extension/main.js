(function(){
	// Set up a global object to store persistent properties
	window.Localisr = window.Localisr || {};

    var timezones = ['A', 'ADT', 'ADT', 'AFT', 'AKDT', 'AKST', 'ALMT', 'AMST', 'AMST', 'AMT', 'AMT', 'ANAST', 'ANAT', 'AQTT', 'ART', 'AST', 'AST', 'AST', 'AST', 'AZOST', 'AZOT', 'AZST', 'AZT', 'B', 'BNT', 'BOT', 'BRST', 'BRT', 'BST', 'BST', 'BTT', 'C', 'CAST', 'CAT', 'CCT', 'CDT', 'CDT', 'CDT', 'CEST', 'CET', 'CET', 'CHADT', 'CHAST', 'CKT', 'CLST', 'CLT', 'COT', 'CST', 'CST', 'CST', 'CST', 'CST', 'CVT', 'CXT', 'ChST', 'D', 'DAVT', 'E', 'EASST', 'EAST', 'EAT', 'EAT', 'ECT', 'EDT', 'EDT', 'EDT', 'EDT', 'EEST', 'EEST', 'EEST', 'EET', 'EET', 'EET', 'EGST', 'EGT', 'EST', 'EST', 'EST', 'EST', 'ET', 'ET', 'ET', 'F', 'FJST', 'FJT', 'FKST', 'FKT', 'FNT', 'G', 'GALT', 'GAMT', 'GET', 'GFT', 'GILT', 'GMT', 'GMT', 'GST', 'GYT', 'H', 'HAA', 'HAA', 'HAC', 'HADT', 'HAE', 'HAE', 'HAP', 'HAR', 'HAST', 'HAT', 'HAY', 'HKT', 'HLV', 'HNA', 'HNA', 'HNA', 'HNC', 'HNC', 'HNE', 'HNE', 'HNE', 'HNP', 'HNR', 'HNT', 'HNY', 'HOVT', 'I', 'ICT', 'IDT', 'IOT', 'IRDT', 'IRKST', 'IRKT', 'IRST', 'IST', 'IST', 'IST', 'JST', 'K', 'KGT', 'KRAST', 'KRAT', 'KST', 'KUYT', 'L', 'LHDT', 'LHST', 'LINT', 'M', 'MAGST', 'MAGT', 'MART', 'MAWT', 'MDT', 'MESZ', 'MEZ', 'MHT', 'MMT', 'MSD', 'MSK', 'MST', 'MUT', 'MVT', 'MYT', 'N', 'NCT', 'NDT', 'NFT', 'NOVST', 'NOVT', 'NPT', 'NST', 'NUT', 'NZDT', 'NZDT', 'NZST', 'NZST', 'O', 'OMSST', 'OMST', 'P', 'PDT', 'PET', 'PETST', 'PETT', 'PGT', 'PHOT', 'PHT', 'PKT', 'PMDT', 'PMST', 'PONT', 'PST', 'PST', 'PT', 'PWT', 'PYST', 'PYT', 'Q', 'R', 'RET', 'S', 'SAMT', 'SAST', 'SBT', 'SCT', 'SGT', 'SRT', 'SST', 'T', 'TAHT', 'TFT', 'TJT', 'TKT', 'TLT', 'TMT', 'TVT', 'U', 'ULAT', 'UYST', 'UYT', 'UZT', 'V', 'VET', 'VLAST', 'VLAT', 'VUT', 'W', 'WAST', 'WAT', 'WDT', 'WEST', 'WEST', 'WESZ', 'WET', 'WET', 'WEZ', 'WFT', 'WGST', 'WGT', 'WIB', 'WIT', 'WITA', 'WST', 'WST', 'WST', 'WT', 'X', 'Y', 'YAKST', 'YAKT', 'YAPT', 'YEKST', 'YEKT', 'Z'];

	var acronyms = ['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYR', 'BZD', 'CAD', 'CDF', 'CHF', 'CLF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'STD', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMK', 'ZWL'];
	var symbols = ['£', '€', '¥', '$'];
    var currencies = [];
    var i;
    for(i = 0; i < acronyms.length; i++){
		currencies.push(acronyms[i]);
    }
    for(i = 0; i < symbols.length; i++){
		var symbol = symbols[i];
		if(symbol === '$'){
			symbol = '\\$';
		}
		currencies.push(symbol);
    }

	var basePriceRegex = "[0-9]+\\.?([0-9]{2})?";//(\\s|\\.|$)+";

	// Characters used for both matching and replacing
	var types = "(" + currencies.join('|') + "){1}";
	var commonString = types + "\\s*" + basePriceRegex;

	// Regex used for determining whether there is a price in a string
	var matchRegex = new RegExp("(^|\\s)+" + commonString, 'g');
	// Regex for replacing the price in the string
	var replaceRegex = new RegExp(commonString, 'g');
	var typeRegex = new RegExp(types, 'g');


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

	var isTime = function(s){
		return s.match(/^[0-9]{1,2}:[0-9]{2}$/);
	};

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

				if(matches && typeMatches){
					var replacements = text.match(replaceRegex);

					for(var i = 0; i < matches.length; i++){
						// debugger;
						if(!(matches[i] && typeMatches[i])){ break; }
						containsCurrency = true;

						// Extract a string containing just the numerical price from the text
						var oldPrice = matches[i];

						var type = typeMatches[i];
						// Convert them to the user's currency
						var newPrice = convertPrice(oldPrice, type);

						// Replace the old price string with the new one
						text = text.replace(replacements[i], generateCurrencyReplacement(oldPrice, newPrice));
					}
				}

				// If any replacements have been made, replace the text node with a span element containing the converted text
				if(containsCurrency){
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

		targetSymbol = acronymMap[targetCurrency];
		targetTimezone = 'GMT';
		money.base = 'USD';

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

	// If the page is in a converted state then restore the original
	if(Localisr.isConverted){
		Localisr.isConverted = false;
		restore('body');
	}
	// Otherwise convert it
	else {
		Localisr.isConverted = true;
		complete = [false, false];

		chrome.extension.sendMessage(
			{
				method: 'getExchangeRates'
			},
			function(exchangeRates){
				// debugger;
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
				// debugger;
				targetCurrency = response.data;
				complete[1] = true;
				init();
			}
		);
	}

}());
