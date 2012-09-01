// var s = document.createElement('script');

var isTime = function(s){
	return s.match(/[0-9]{2}:[0-9]{2}/);
};

var words = jQuery('body').html().split(' ');

// console.log(words);
for (var i = 0; i < words.length; i++) {
	if(isTime(words[i])){
		var temp = jQuery('<div>');
		var wrapper = jQuery('<span>');
		wrapper.css({color: 'red'});
		wrapper.text(words[i]);
		temp.html(wrapper);
		words[i] = temp.html();
	}
	// else {
	// 	words[i] =
	// }
}


jQuery('body').html(words.join(' '));
