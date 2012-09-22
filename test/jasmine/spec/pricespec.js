describe('The price conversion module', function(){
	it('should be able to convert a price string to a new price string in the user\'s chosen currency', function(){
		targetCurrency = 'USD';
		expect(convertPrice('£100', '£')).toBe('$200.00');
	});
});
