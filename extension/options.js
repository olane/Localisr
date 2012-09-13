(function(){
    var optionTypes = ['currency', 'timezone'];
    var currencies = ['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYR', 'BZD', 'CAD', 'CDF', 'CHF', 'CLF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'STD', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMK', 'ZWL'];
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

        $('#alwaysrun').val(localStorage['alwaysrun']);
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
