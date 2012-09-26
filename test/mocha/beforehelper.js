// Mock the Chrome API
chrome = {
    extension: {
        onMessage: {
            addListener: function(){}
        },
        sendMessage: function(){}
    }
};

// Dummy data for testing conversion functions
timezones = {
    'GMT': {
        offset: 0
    },
    'EST': {
        offset: -5
    },
    'PST': {
        offset: -8
    },
    'ADT': {
        offset: -3
    }
};

currencyAcronyms = ['GBP', 'USD'];

money.rates = {
    'USD': 1,
    'GBP': 0.5
};

// beforeEach(function() {
//   this.addMatchers({
//     toBePlaying: function(expectedSong) {
//       var player = this.actual;
//       return player.currentlyPlayingSong === expectedSong &&
//              player.isPlaying;
//     }
//   });
// });
