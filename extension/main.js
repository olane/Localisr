(function(){

	// Load these from a preferences file
	var targetCurrency = "USD";
	var targetUTCOffset = 0;

	var targetSymbol;

	switch(targetCurrency){
		case 'GBP':
			targetSymbol = '£';
			break;
		case 'USD':
			targetSymbol = '$';
			break;
		case 'EUR':
			targetSymbol = '€';
			break;
	}


	var CurrencyTypes = {
		NOT: 0,
		NORMAL: 1,
		THOUSAND: 2,
		MILLION: 3,
		BILLION: 4,
		TRILLION: 5
	};

	var isTime = function(s){
		return s.match(/^[0-9]{1,2}:[0-9]{2}$/);
	};

	var getCurrencyType = function(s){
		if(s.match(/^(£|\$|€){1}[0-9]+\.?([0-9]{2})?$/)){
			return CurrencyTypes.NORMAL;
		}
		if(s.match(/^(£|\$|€){1}[0-9]+\.?([0-9]+)?\s+m(illion)?$/)){
			return CurrencyTypes.MILLION;
		}

		return CurrencyTypes.NOT;
	};

	var convertPrice = function(s){
		var type = s[0];
		var acronym;
		// debugger;
		switch(type){
			case '£':
				acronym = 'GBP';
				break;
			case '$':
				acronym = 'USD';
				break;
			case '€':
				acronym = 'EUR';
				break;

			default:
				console.log('unsupported currency');
				return null;

		}

		var price = accounting.unformat(s);
		var newPrice = fx.convert(price, {from: acronym, to: targetCurrency});
		var newPriceString = accounting.formatMoney(newPrice, targetSymbol, 2);
		// console.log(price);
		return newPriceString;
	};

	var scan = function(element){
		$(element).contents().each(function(index){
			if(this.nodeType === 3){
				var text = this.textContent;
				words = text.split(' ');
				var containsCurrency = false;

				for (var i = 0; i < words.length; i++) {
					var currencyType = getCurrencyType(words[i]);

					if(currencyType !== CurrencyTypes.NOT){
						containsCurrency = true;
						var newPrice = convertPrice(words[i]);

						if(newPrice !== null){
							words[i] = newPrice;

							var temp = $('<div>');
							var wrapper = $('<span>')
								.css({color: 'red'})
								.text(words[i])
								.addClass('converted-price');
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

	$.ajax({
		url: "http://openexchangerates.org/api/latest.json",
		data: {
			app_id: "73f701531dc640fb8ec624faf83ee842"
		},
		success: function(data){
			console.log(data);

			fx.base = 'USD';
			fx.rates = data.rates;

			scan('body');
		}

	});

}());
