var run = function(){
	var urls = localStorage.alwaysrun;
	debugger;
	if(!urls){ return; }
	urls = urls.split('\n');

	for(var i = 0; i < urls.length; i++){
		if(window.location.href.match(new RegExp(urls[i]))){
			chrome.extension.sendMessage({method: 'injectScript'});
			return;
		}
	}
};

run();
