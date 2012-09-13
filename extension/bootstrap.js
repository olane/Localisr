if(window.location.href.match(/localdhost/)){
	chrome.extension.sendMessage({method: 'injectScript'});
}
