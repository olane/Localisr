var cacheAge = 60 * 60; // seconds

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

chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.executeScript(
        null,
        {
            file: "main.js"
        }
    );
});

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

        default:
            sendResponse({});
            break;
    }
});
