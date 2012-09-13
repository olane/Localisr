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
			timeString = "[0-9]{1,2}\\s*:\\s*[0-9]{2}\\s*((am)|(pm))?\\s*" + timezonesString;
			timezonesRegex = new RegExp(timezonesString, 'g');
			timeRegex = new RegExp(start + timeString + end, 'gi');
			timeReplaceRegex = new RegExp(timeString, 'gi');
			complete[2] = true;
			init();
		}
	);
}
