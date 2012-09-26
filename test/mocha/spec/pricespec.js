describe('The price conversion module', function(){
	it('should be able to convert a price string to a new price string in the user\'s chosen currency', function(){
		targetCurrency = 'USD';
		convertPrice('£100', '£').should.equal('$200.00');
	});

	it('should throw an error if the currency string passed is not a valid symbol or three-letter acronym', function(){
		(function(){
			convertPrice('£100', 'AAA');
		}).should.Throw('Invalid currency string: AAA');

		(function(){
			convertPrice('£100', null);
		}).should.Throw('Invalid currency string: null');
	});

	describe('The regular expressions for parsing price strings', function(){
		it('should detect multiple prices in a string containing other text', function(){
			var testString = 'Lorem ipsum £100 dolor $189.23 sit GBP 500 amet.';
			var matches = testString.match(r.regexp.price.matchers[0]);
			matches.should.have.length(3);
		});

		it('should ignore symbols and acronyms not adjacent to prices', function(){
			var testString = 'Loads of symbols and acronyms £ hello $ bye £ word AED $ BTN Japanese Yen ¥27383.43 £120';
			var matches = testString.match(r.regexp.price.matchers[0]);
			matches.should.have.length(2);
		});

		it('should recognise prices and the start and end of string', function(){
			var testString = '£890 a b c $290.';
			var matches = testString.match(r.regexp.price.matchers[0]);
			matches.should.have.length(2);
		});

		it('should detect currency acronyms in upper or lower case', function(){
			'usd 8'.match(r.regexp.price.matchers[0]).should.have.length(1);
			'usd gbp'.match(r.regexp.price.currencies).should.have.length(2);
		});

		it('should detect currency in the form "$100 USD"', function(){
			// '$100 USD'.match(r.regexp.price.matchers[1]).should.have.length(1);
		});
	});

	describe('The function for converting all prices in a text node', function(){
		it('should not perform the conversion on a price that is already in the user\'s target currency', function(){
			targetCurrency = 'GBP';
			var text = 'Lorem GBP 100 ipsum';
			var matches = text.match(r.regexp.price.matchers[0]);
			var priceConverter = converters[0];
			priceConverter(text, matches).should.equal(text);
		});
	});
});
