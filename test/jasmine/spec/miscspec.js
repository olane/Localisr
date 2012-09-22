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
});
