(function(){
    var optionTypes = ['timezone', 'currency'];

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

        restoreOptions();
    });

}());
