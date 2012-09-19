// Recursively scans an element and all of its children, and tries to convert the times and prices
// in all the text nodes.
var scan = function(element){
	$(element).contents().each(function(index){
		if(this.nodeType === 3){
			// The node is a text node so it can be parsed for currencies
			var text = this.textContent;
			var oldText = text;

			var replaced = false;
			var matches = text.match(matchRegex);
			var typeMatches = text.match(typeRegex);

			var replacements, i;

			if(matches && typeMatches){
				replacements = text.match(replaceRegex);

				for(i = 0; i < matches.length; i++){
					if(!(matches[i] && typeMatches[i])){ break; }
					replaced = true;

					// Extract a string containing just the numerical price from the text
					var oldPrice = matches[i];

					var type = typeMatches[i];
					// Convert them to the user's currency
					var newPrice = convertPrice(oldPrice, type);

					// Replace the old price string with the new one
					text = text.replace(replacements[i], generateReplacement(oldPrice, newPrice, 'price'));
				}
			}

			var timeMatches = text.match(timeRegex);

			if(timeMatches){
				replacements = text.match(timeReplaceRegex);
				var tz = text.match(timezonesRegex);

				for(i = 0; i < timeMatches.length; i++){
					if(!timeMatches[i]){ break; }

					var oldTime = timeMatches[i];
					var newTime;
					if(oldTime.match(r.regexp.time.separators)){
						newTime = parseTimeWithMinutes(oldTime, tz[i]);
					}
					else{
						// debugger;
						newTime = parseTime(oldTime, tz[i]);
					}

					if(newTime !== null){
						text = text.replace(replacements[i], generateReplacement(oldTime, newTime, 'time'));
						replaced = true;
					}
				}
			}

			// If any replacements have been made, replace the text node with a span element containing the converted text
			if(replaced){
				var replacement = $('<span>')
					.attr('data-original-text', oldText)
					.html(text);

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

var init = function(){
	var acronyms = [];
	for(var key in timezones){
		acronyms.push(key);
	}

	timezonesString = '(' + acronyms.join('|') + '){1}';
	timeString = "[0-9]{1,2}" + // One or two digits
		"(\\s*" + r.string.time.separators + "\\s*[0-9]{2}\\s*)?" + // All or none of: one separator then two digits, optionally separated by whitespace
		"((am)|(pm))?\\s*" + // Optional AM/PM
		timezonesString; // One of the timezone acronyms

	timezonesRegex = new RegExp(timezonesString, 'gi');
	timeRegex = new RegExp(r.base.start + timeString + r.base.end, 'gi');
	timeReplaceRegex = new RegExp(timeString, 'gi');

	targetSymbol = acronymMap[targetCurrency] || targetCurrency + ' ';
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

chrome.extension.sendMessage({method: 'getAutoRunURLs'}, function(urls){
	if(!urls){ return; }
	urls = urls.split('\n');

	for(var i = 0; i < urls.length; i++){
		var url = urls[i];
		if(url && window.location.href.match(new RegExp(url))){
			chrome.extension.sendMessage({method: 'runScript'});
			return;
		}
	}
});
