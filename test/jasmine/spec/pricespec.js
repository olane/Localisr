describe('The price conversion module', function(){
	it('should be able to convert a price string to a new price string in the user\'s chosen currency', function(){
		targetCurrency = 'USD';
		expect(convertPrice('£100', '£')).toBe('$200.00');
	});

	it('should throw an error if the currency string passed is not a valid symbol or three-letter acronym', function(){
		expect(function(){
			convertPrice('£100', 'AAA');
		}).toThrow('Invalid currency string: AAA');

		expect(function(){
			convertPrice('£100', null);
		}).toThrow('Invalid currency string: null');
	});

	describe('The regular expressions for parsing price strings', function(){
		it('should detect multiple prices in a string containing other text', function(){
			var testString = 'Lorem ipsum £100 dolor $189.23 sit GBP 500 amet.';
			var matches = testString.match(r.regexp.price.matcher);
			expect(matches.length).toBe(3);
		});

		it('should ignore symbols and acronyms not adjacent to prices', function(){
			var testString = 'Loads of symbols and acronyms £ hello $ bye £ word AED $ BTN Japanese Yen ¥27383.43 £120';
			var matches = testString.match(r.regexp.price.matcher);
			expect(matches.length).toBe(2);
		});

		it('should recognise prices and the start and end of string', function(){
			var testString = '£890 a b c $290.';
			var matches = testString.match(r.regexp.price.matcher);
			expect(matches.length).toBe(2);
		});

		it('should detect currency acronyms in upper or lower case', function(){
			expect('usd 8'.match(r.regexp.price.matcher).length).toBe(1);
			expect('usd gbp'.match(r.regexp.price.currencies).length).toBe(2);
		});
	});

	describe('The function for converting all prices in a text node', function(){
		it('should not perform the conversion on a price that is already in the user\'s target currency', function(){
			targetCurrency = 'GBP';
			var text = 'Lorem GBP 100 ipsum';
			var matches = text.match(r.regexp.price.matcher);
			var priceConverter = converters[0];
			expect(priceConverter(text, matches)).toBe(text);
		});
	});
});
