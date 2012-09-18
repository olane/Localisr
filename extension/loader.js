var cacheAge = 60 * 60; // seconds
var timezones;
var tabsConverted = {};
var currentURL = "";

// Load the exchange rates from the API and save them to localStorage
var loadExchangeRates = function(){
    var needsLoad = false;

    // If there are cached rates that have expired
    if(localStorage['exchangerates']){
        var currentAge = (new Date()).getTime() / 1000 - parseInt(localStorage['timestamp'], 10);
        if(currentAge >= cacheAge){
            needsLoad = true;
        }
    }
    // Or no rates at all
    else{
        needsLoad = true;
    }

    // Load and save the latest data
    if(needsLoad){
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
    }
};

// Load the map of timezone offsets and acronyms just once per session
$.ajax({
    url: "zones.json",
    async: false,
    dataType: 'json',
    success: function(data){
        timezones = data;
    }
});

// Send a message to the content script to either convert or restore the state of the page
var runScript = function(tabID){
    // console.log(tabID);
    var key = tabID.toString();

    // Make sure there are some exchange rates to send
    loadExchangeRates();

    // Pass the settings to the content script
    chrome.tabs.sendMessage(
        tabID,
        {
            method: 'run',

            isConverted: tabsConverted[key],

            currency: localStorage['currency'],
            timezone: localStorage['timezone'],
            rates: JSON.parse(localStorage['exchangerates']).rates,
            timezones: timezones

        },
        function(response){
            console.log(response);
        }
    );
};

// Run the extension when the user clicks on its icon
chrome.browserAction.onClicked.addListener(function(tab){
    var key = tab.id.toString();

    // Keep track of whether the current tab is converted or not
    if(tabsConverted.hasOwnProperty(key)){
        tabsConverted[key] = !tabsConverted[key];
    }
    else{
        tabsConverted[key] = false;
    }

    runScript(tab.id);
});

// Or if they visit a page that matches the list of URLs in the settings
// chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
//     currentURL = changeInfo.url || currentURL;
//     var urls = localStorage.alwaysrun;
//     if(!urls){ return; }
//     urls = urls.split('\n');

//     for(var i = 0; i < urls.length; i++){
//         var url = urls[i];
//         if(url && currentURL && currentURL.match(new RegExp(url))){
//             runScript(tab.id);
//             return;
//         }
//     }
// });

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
    switch(request.method){
        case 'getLocalStorage':
            sendResponse({data: localStorage[request.key]});
            break;

        case 'getAutoRunURLs':
            var urls = localStorage.alwaysrun || null;
            sendResponse(urls);
            break;

        case 'runScript':
            chrome.tabs.getSelected(null, function(tab){
                tabsConverted[tab.id.toString()] = false;
                runScript(tab.id);
            });
            break;

        default:
            sendResponse({});
            break;
    }
});
