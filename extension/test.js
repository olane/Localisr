fx.base = "USD";
fx.rates = {
	"EUR" : 0.745101,
	"GBP" : 0.647710,
	"HKD" : 7.781919,
	"USD" : 1
};

var isTime = function(s){
	return s.match(/^[0-9]{1,2}:[0-9]{2}$/);
};

var isCurrency = function(s){
	return s.match(/^(£|\$){1}[0-9]+(\.[0-9]{2})?$/);
};

var convertPrice = function(s){
	var type = s[0];
	var acronymn;
	switch(type){
		case '£':
			acronymn = 'GBP';
			break;
		case '$':
			acronymn = 'USD';
			break;
	}

	var price = parseFloat(s.substring(1, s.length));
	var newPrice = fx.convert(price, {from: acronymn, to: 'USD'});
	var newPriceString = '$' + newPrice.toFixed(2);
	console.log(price);
	return newPriceString;
};

var scan = function(element){
	$(element).contents().each(function(index){
		if(this.nodeType == 3){
			var text = this.textContent;
			words = text.split(' ');
			var containsCurrency = false;
			for (var i = 0; i < words.length; i++) {
				if(isCurrency(words[i])){
					containsCurrency = true;
					words[i] = convertPrice(words[i]);

					var temp = $('<div>');
					var wrapper = $('<span>')
						.css({color: 'red'})
						.text(words[i])
						.addClass('converted-price');
					temp.html(wrapper);
					words[i] = temp.html();
				}
			}
			if(containsCurrency){
				$(this).parent().append(words.join(' '));
				$(this).remove();
			}
		}
		else if(this.nodeType == 1){
			scan(this);
		}
	});
};

scan('body');
