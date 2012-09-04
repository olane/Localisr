(function(){
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
		if(s.match(/^(£|\$|€|¥){1}[0-9]+\.?([0-9]{2})?$/)){
			return CurrencyTypes.NORMAL;
		}
		if(s.match(/^(£|\$|€|¥){1}[0-9]+\.?([0-9]+)?\s+m(illion)?$/)){
			return CurrencyTypes.MILLION;
		}

		return CurrencyTypes.NOT;
	};

	var convertPrice = function(s){
		var symbol = s[0];
		var acronym = symbolMap[symbol];
		if(acronym === undefined){
			console.log('unsupported currency');
			return null;
		}

		var price = accounting.unformat(s);
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

	var scan = function(element){
		// debugger;
		$(element).contents().each(function(index){
			if(this.nodeType === 3){
				var text = this.textContent;
				words = text.split(' ');
				var containsCurrency = false;

				for (var i = 0; i < words.length; i++) {
					var currencyType = getCurrencyType(words[i]);

					if(currencyType !== CurrencyTypes.NOT){
						containsCurrency = true;
						var oldPrice = words[i];
						var newPrice = convertPrice(oldPrice);

						if(newPrice !== null){

							var temp = $('<div>');

							var hover = $('<span>')
								.addClass('converted-price-hover')
								.css(hoverStyle)
								.text("Original price: " + oldPrice);

							var wrapper = $('<span>')
								.text(newPrice)
								.addClass('converted-price')
								.css('position', 'relative')
								.append(hover);

							temp.html(wrapper);
							words[i] = temp.html();
						}
					}
				}

				if(containsCurrency){
					$(this).parent().append(words.join(' '));
					$(this).remove();
				}
			}
			else if(this.nodeType === 1 && this.nodeName.toLowerCase() !== 'iframe'){
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
