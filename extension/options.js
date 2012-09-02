(function(){
    var optionTypes = ['timezone', 'currency'];
    var timezones = ['A', 'ADT', 'ADT', 'AFT', 'AKDT', 'AKST', 'ALMT', 'AMST', 'AMST', 'AMT', 'AMT', 'ANAST', 'ANAT', 'AQTT', 'ART', 'AST', 'AST', 'AST', 'AST', 'AZOST', 'AZOT', 'AZST', 'AZT', 'B', 'BNT', 'BOT', 'BRST', 'BRT', 'BST', 'BST', 'BTT', 'C', 'CAST', 'CAT', 'CCT', 'CDT', 'CDT', 'CDT', 'CEST', 'CET', 'CET', 'CHADT', 'CHAST', 'CKT', 'CLST', 'CLT', 'COT', 'CST', 'CST', 'CST', 'CST', 'CST', 'CVT', 'CXT', 'ChST', 'D', 'DAVT', 'E', 'EASST', 'EAST', 'EAT', 'EAT', 'ECT', 'EDT', 'EDT', 'EDT', 'EDT', 'EEST', 'EEST', 'EEST', 'EET', 'EET', 'EET', 'EGST', 'EGT', 'EST', 'EST', 'EST', 'EST', 'ET', 'ET', 'ET', 'F', 'FJST', 'FJT', 'FKST', 'FKT', 'FNT', 'G', 'GALT', 'GAMT', 'GET', 'GFT', 'GILT', 'GMT', 'GMT', 'GST', 'GYT', 'H', 'HAA', 'HAA', 'HAC', 'HADT', 'HAE', 'HAE', 'HAP', 'HAR', 'HAST', 'HAT', 'HAY', 'HKT', 'HLV', 'HNA', 'HNA', 'HNA', 'HNC', 'HNC', 'HNE', 'HNE', 'HNE', 'HNP', 'HNR', 'HNT', 'HNY', 'HOVT', 'I', 'ICT', 'IDT', 'IOT', 'IRDT', 'IRKST', 'IRKT', 'IRST', 'IST', 'IST', 'IST', 'JST', 'K', 'KGT', 'KRAST', 'KRAT', 'KST', 'KUYT', 'L', 'LHDT', 'LHST', 'LINT', 'M', 'MAGST', 'MAGT', 'MART', 'MAWT', 'MDT', 'MESZ', 'MEZ', 'MHT', 'MMT', 'MSD', 'MSK', 'MST', 'MUT', 'MVT', 'MYT', 'N', 'NCT', 'NDT', 'NFT', 'NOVST', 'NOVT', 'NPT', 'NST', 'NUT', 'NZDT', 'NZDT', 'NZST', 'NZST', 'O', 'OMSST', 'OMST', 'P', 'PDT', 'PET', 'PETST', 'PETT', 'PGT', 'PHOT', 'PHT', 'PKT', 'PMDT', 'PMST', 'PONT', 'PST', 'PST', 'PT', 'PWT', 'PYST', 'PYT', 'Q', 'R', 'RET', 'S', 'SAMT', 'SAST', 'SBT', 'SCT', 'SGT', 'SRT', 'SST', 'T', 'TAHT', 'TFT', 'TJT', 'TKT', 'TLT', 'TMT', 'TVT', 'U', 'ULAT', 'UYST', 'UYT', 'UZT', 'V', 'VET', 'VLAST', 'VLAT', 'VUT', 'W', 'WAST', 'WAT', 'WDT', 'WEST', 'WEST', 'WESZ', 'WET', 'WET', 'WEZ', 'WFT', 'WGST', 'WGT', 'WIB', 'WIT', 'WITA', 'WST', 'WST', 'WST', 'WT', 'X', 'Y', 'YAKST', 'YAKT', 'YAPT', 'YEKST', 'YEKT', 'Z'];
    var currencies = ['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYR', 'BZD', 'CAD', 'CDF', 'CHF', 'CLF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LTL', 'LVL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'STD', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VEF', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMK', 'ZWL'];
    var data = [timezones, currencies];

    // Saves options to localStorage.
    var saveOptions = function(){
        for (var i = 0; i < optionTypes.length; i++){
            var optionType = optionTypes[i];
            var select = $('#' + optionType)[0];
            var timezone = select.children[select.selectedIndex].value;
            localStorage[optionType] = timezone;
        }

        // Update status to let user know options were saved.
        var status = $("#status")
            .text("Options Saved.");
        setTimeout(function(){
            status.empty();
        }, 750);
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
