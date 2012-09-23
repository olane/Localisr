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
			expect(inverted.test).toBe('bar');
			expect(inverted['true']).toBe('boolean');
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
			expect(arr.length).toBe(3);
			expect(arr[0]).toBe('a');
			expect(arr[2]).toBe('c');
			expect(arr[89]).toBeUndefined();
		});
	});

	describe('The function for generating a string of html to replace a converted value', function(){
		var replacement;

		beforeEach(function(){
			replacement = generateReplacement('£100', '$120', 'price');
		});

		it('should return a non-empty string', function(){
			expect(replacement).toBeDefined();
			expect(typeof replacement).toBe('string');
			expect(replacement.length).toBeGreaterThan(0);
		});

		it('should return a string of html that can be parsed by jQuery', function(){
			expect($.parseHTML(replacement)).not.toBe(null);
		});

		it('should have a span tag as the root element with a class of "converted-value"', function(){
			var elem = $(replacement);
			expect(elem[0].nodeName).toBe('SPAN');
			expect(elem.hasClass('converted-value')).toBe(true);
		});
	});

	describe('The functions for traversing and converting the DOM', function(){
		it('should leave the DOM in its original state after converting followed by restoring', function(){
			var original = $('body').html();
			convert('body');
			restore('body');
			expect($('body').html()).toBe(original);
		});
	});
});
