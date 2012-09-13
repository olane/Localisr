var cacheAge = 60 * 60; // seconds
var debug = true;

var loadExchangeRates = function(){
    $.ajax({
        url: "http://openexchangerates.org/api/latest.json",
        data: {
            app_id: "73f701531dc640fb8ec624faf83ee842"
        },
        async: false,
        success: function(data){
            console.log(data);
            localStorage['exchangerates'] = JSON.stringify(data);
            localStorage['timestamp'] = data.timestamp;
        }
    });
};

var injectScript = function(){
    var file = debug ? 'localisr.js' : 'localisr.min.js';
    chrome.tabs.executeScript(
        null,
        {
            file: file
        }
    );
};

chrome.browserAction.onClicked.addListener(function(tab){
    injectScript();
});

var currentURL = "";

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
//     currentURL = changeInfo.url || currentURL;
//     var urls = localStorage.alwaysrun;
//     if(!urls){ return; }
//     urls = urls.split('\n');

//     for(var i = 0; i < urls.length; i++){
//         if(currentURL.match(new RegExp(urls[i]))){
//             chrome.extension.sendMessage({method: 'injectScript'});
//             return;
//         }
//     }
// });

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
    switch(request.method){
        case 'getLocalStorage':
            sendResponse({data: localStorage[request.key]});
            break;

        case 'getExchangeRates':
            var currentAge = (new Date()).getTime() / 1000 - parseInt(localStorage['timestamp'], 10);
            if(!localStorage['exchangerates'] || currentAge >= cacheAge){
                loadExchangeRates();
            }
            sendResponse({data: JSON.parse(localStorage['exchangerates'])});

            break;

        case 'getTimezones':
            var d;
            $.ajax({
                url: "zones.json",
                async: false,
                dataType: 'json',
                success: function(data){
                    console.log(data);
                    d = data;
                }
            });
            sendResponse(d);

            break;

        case 'injectScript':
            injectScript();
            break;

        default:
            sendResponse({});
            break;
    }
});
