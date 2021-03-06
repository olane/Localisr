var converters = [
	// Price converter
	function(text, matches){
		for(var i = 0; i < matches.length; i++){
			var oldPrice = matches[i];
			if(oldPrice){
				var currency = oldPrice.match(r.regexp.price.currencies)[0].toUpperCase();

				// Don't convert prices that are already in the user's target currency
				if(currency === targetCurrency || currency === targetSymbol){ continue; }

				// Convert them to the user's currency
				var newPrice = convertPrice(oldPrice, currency);

				// Replace the old price string with the new one
				text = text.replace(oldPrice, generateReplacement(oldPrice, newPrice, 'price'));
			}
		}

		return text;
	},

	// Time converter
	function(text, matches){
		// Loop through the array of matched times to convert them
		for(var i = 0; i < matches.length; i++){
			// Store the original time
			var oldTime = matches[i];

			// string.match() sometimes returns empty strings or undefined, so ignore these
			if(oldTime){
				// Extract just the timezone acronym from the time string
				var timezone = oldTime.match(r.regexp.time.timezones)[0].toUpperCase();
				// Don't convert times that are already in the user's target timezone
				if(timezone === targetTimezone){ continue; }

				var newTime;
				// If the time string matched the regex and has a separator character in it, it must also have minutes
				if(oldTime.match(r.regexp.time.separators)){
					newTime = parseTimeWithMinutes(oldTime, timezone);
				}
				// Otherwise it's just got hours
				else{
					newTime = parseTime(oldTime, timezone);
				}

				// Don't perform the replacement if the conversion failed
				if(newTime !== null){
					// Replace the current occurence of a time in the text node with a html string replacement for the converted time and popup box
					text = text.replace(oldTime, generateReplacement(oldTime, newTime, 'time'));
				}
			}
		}

		return text;
	}
];

// Converts any price and time strings in any text nodes in the element, then recursively converts any child elements
var convert = function(element){
	$(element).contents().each(function(index){
		if(this.nodeType === 3){
			// The node is a text node so it can be parsed for currencies
			var text = this.textContent;
			var oldText = text;

			for(var i = 0; i < 2; i++){
				var matchers = [r.regexp.price.matchers, [r.regexp.time.matcher]][i];
				for(var j = 0; j < matchers.length; j++){
					var matcher = matchers[j];
					// Get an array of every substring in the current text node that is a valid price or time
					var matches = text.match(matcher);

					// If there are any matches
					if(matches){
						text = converters[i](text, matches);
					}
				}

			}

			// If any replacements have been made, replace the text node with a span element containing the converted text
			if(text !== oldText){
				var replacement = $('<span>')
					.attr('data-original-text', oldText)
					.html(text);

				$(this).replaceWith(replacement);
			}
		}

		else if(shouldParse(this)){
			// The node is an element node so recursively scan it for more text nodes
			convert(this);
		}
	});
};


// Recursively restores an element and all its children to previous values after conversion
var restore = function(element){
	// Loop through all child nodes of the element
	$(element).contents().each(function(index){
		var nodeName = this.nodeName.toLowerCase();
		if(shouldParse(this)){

			// If the node is a span node
			if(nodeName === 'span'){
				var t = $(this);
				var originalText = t.attr('data-original-text');

				// and is a converted time or price
				if(originalText){
					// Replace the span node with a text node contaning the original text from before the conversion
					var replacement = document.createTextNode(originalText);
					t.replaceWith(replacement);
					return;
				}
			}

			// Otherwise call recursively to restore any children of this node to their original state
			restore(this);
		}
	});
};

var init = function(){
	setupCurrencies(arrayOfKeys(money.rates));
	setupTimes(arrayOfKeys(timezones));

	// If the user's target currency has a symbol then use it, otherwise use the acronym as the symbol
	targetSymbol = acronymMap[targetCurrency] || targetCurrency + ' ';

	// Convert all the times and prices on the page
	convert('body');

	// Bind the mouse events for the 'original value' popups
	$('.converted-value')
		.on('mouseenter', function(){
			$(this).find('.converted-value-hover').show();
		})
		.on('mouseout', function(){
			$(this).find('.converted-value-hover').hide();
		});

	// Set the position of the popups
	$('.converted-value-hover').each(function(){
		var t = $(this);
		t.css('bottom', -(t.height() + 10));
	});
};

// Triggered when a message is sent from the background script containing the data needed to convert the page
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse){
		if(request.method === 'run'){
			// If the page is in a converted state then restore the original
			if(request.isConverted){
				restore('body');
			}
			// Otherwise convert it
			else {
				money.rates = request.rates;
				targetCurrency = request.currency || 'AED';
				targetTimezone = request.timezone || 'UTC';
				timezones = request.timezones;

				init();
			}
		}
	}
);

// Check if the current page's URL matches the user's list of URLs on which the extension should automatically run
chrome.extension.sendMessage({method: 'getAutoRunURLs'}, function(urls){
	if(!urls){ return; }
	urls = urls.split('\n');

	for(var i = 0; i < urls.length; i++){
		var url = urls[i];
		// If it matches, send a request to the background script to pass the necessary data to convert the page
		if(url && window.location.href.match(new RegExp(url))){
			chrome.extension.sendMessage({method: 'runScript'});
			return;
		}
	}
});
