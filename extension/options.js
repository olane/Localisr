(function(){
    // Creates an array of strings from the keys of an object
    var arrayOfKeys = function(obj){
        var array = [];
        for(var key in obj){
            array.push(key);
        }
        return array;
    };

    var optionTypes = ['currency', 'timezone'];
    var currencies = arrayOfKeys(JSON.parse(localStorage.exchangerates).rates);
    var timezones = [];
    $.ajax({
        url: "zones.json",
        async: false,
        dataType: 'json',
        success: function(data){
            for(var key in data){
                timezones.push(key);
            }
        }
    });

    var data = [currencies, timezones];

    // Saves options to localStorage.
    var saveOptions = function(){
        for (var i = 0; i < optionTypes.length; i++){
            var optionType = optionTypes[i];
            var select = $('#' + optionType)[0];
            var timezone = select.children[select.selectedIndex].value;
            localStorage[optionType] = timezone;
        }

        localStorage['alwaysrun'] = $('#alwaysrun').val();

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
        for (var i = 0; i < optionTypes.length; i++){
            var optionType = optionTypes[i];
            var favorite = localStorage[optionType];
            if (!favorite){ break; }

            var select = $('#' + optionType)[0];
            for (var j = 0; j < select.children.length; j++) {
                var child = select.children[j];
                if (child.value == favorite) {
                    child.selected = "true";
                    break;
                }
            }
        }

        $('#alwaysrun').val(localStorage.alwaysrun);
    };

    $(document).ready(function(){
        $('#save').on('click', function(){
            saveOptions();
        });

        for (var i = 0; i < data.length; i++) {
            var options = [];
            for (var j = 0; j < currencies.length; j++) {
                var string = data[i][j];
                options.push($('<option>').attr('value', string).text(string));
            }
            $('#' + optionTypes[i]).append(options);

        }

        restoreOptions();
    });

}());
