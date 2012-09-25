(function(){
    var timezones, timezoneAcronyms, currencies;

    $.ajax({
        url: "zones.json",
        async: false,
        dataType: 'json',
        success: function(data){
            timezones = data;
        }
    });
    timezoneAcronyms = arrayOfKeys(timezones);

    currencies = arrayOfKeys(JSON.parse(localStorage.exchangerates).rates);


    var optionTypes = ['currency', 'timezone'];
    var data = [currencies, timezoneAcronyms];

    // Saves options to localStorage.
    var saveOptions = function(){
        for (var i = 0; i < optionTypes.length; i++){
            var optionType = optionTypes[i];
            var select = $('#' + optionType)[0];
            var timezone = select.children[select.selectedIndex].value;
            localStorage[optionType] = timezone;
        }

        localStorage.alwaysrun = $('#alwaysrun').val();

        // Update status to let user know options were saved.
        var status = $("#status")
            .text("Options Saved.")
            .css('left', $(document).width() / 2 - $("#status").width() / 2)
            .slideDown('fast')
            .delay(1000)
            .slideUp('fast');
    };

    // Restores select box state to saved value from localStorage.
    var restoreOptions = function(){
        for(var i = 0; i < optionTypes.length; i++){
            var optionType = optionTypes[i];
            var favourite = localStorage[optionType];
            if (!favourite){ continue; }

            $('#' + optionType).children().each(function(){
                if(this.value === favourite){
                    this.selected = true;
                    return;
                }
            });
        }

        $('#alwaysrun').val(localStorage.alwaysrun);
    };

    $(document).ready(function(){
        $('#save').on('click', function(){
            saveOptions();
        });

        for(var i = 0; i < data.length; i++){
            var options = [];
            for(var j = 0; j < data[i].length; j++){
                // String to store in localStorage
                var string = data[i][j];
                // String to display to the user in the list
                var displayString = string;

                // For timezones, display the acronym with the offset eg BST (UTC +0100)
                if(optionTypes[i] === 'timezone'){
                    var offset = timezones[string].offset;
                    displayString += ' (UTC ' + offsetToString(offset) + ')';
                }
                options.push($('<option>').attr('value', string).text(displayString));
            }
            $('#' + optionTypes[i]).append(options);
        }

        restoreOptions();
    });

}());
