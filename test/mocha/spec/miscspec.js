describe('Miscelaneous utility functions', function(){
	describe('The function for inverting an object', function(){
		it('should invert an object where each values is a string, number or boolean, by swapping keys and values', function(){
			var obj = {
				a: 1,
				foo: 'lorem ipsum',
				'boolean': true,
				bar: 'test'
			};
			var inverted = invert(obj);
			inverted.should.contain.keys('lorem ipsum', 'true', 'test');
			inverted.test.should.equal('bar');
			inverted['true'].should.equal('boolean');
		});
	});

	describe('The function for creating an array from the keys of an object', function(){
		it('should return an array of strings, containing the keys of the object', function(){
			var obj = {
				a: 'foo',
				b: 'bar',
				c: 'baz'
			};
			var arr = arrayOfKeys(obj);
			arr.length.should.equal(3);
			arr[0].should.equal('a');
			arr[2].should.equal('c');
			should.not.exist(arr[89]);
		});
	});

	describe('The function for generating a string of html to replace a converted value', function(){
		var replacement;

		beforeEach(function(){
			replacement = generateReplacement('£100', '$120', 'price');
		});

		it('should return a non-empty string', function(){
			replacement.should.not.equal(undefined);
			replacement.should.be.a('string');
			replacement.should.have.length.above(0);
		});

		it('should return a string of html that can be parsed by jQuery', function(){
			$.parseHTML(replacement).should.not.equal(null);
		});

		it('should have a span tag as the root element with a class of "converted-value"', function(){
			var elem = $(replacement);
			elem[0].nodeName.should.equal('SPAN');
			elem.hasClass('converted-value').should.equal(true);
		});
	});

	describe('The functions for traversing and converting the DOM', function(){
		it('should leave the DOM in its original state after converting followed by restoring', function(){
			var original = $('body').html();
			convert('body');
			restore('body');
			$('body').html().should.equal(original);
		});
	});
});
