/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {
    preFill();

    $("#unsubscribeForm").submit(function(event) {
        event.preventDefault();

        var email = $("#unsubscribeForm input#email").val();
        $("#unsubscribeForm input#email").val("");
        callExternalScript("https://perun.metacentrum.cz/cgi-perun/sendVerificationEmail.cgi", {email: email}, function(data) {
            if (data.errorId) {
                switch (data.name) {
                    case "EmailNotSendException":
                        (new Message("Failed to send a email.", "Please, try it later. If problem still persists contact support@elixir-czech.cz", "danger", $("#messager"), false)).draw();
                        break;
                    default :
                        (new Message("Internal error", "Please, try it later. If problem still persists contact support@elixir-czech.cz"
                                +" and attach this error number: "+data.errorId, "danger", $("#messager"), false)).draw();
                        break;
                }
            } else {
                (new Message("a confirmation email", "has been sent to " + email, "success")).draw();
            }

        });

    });

});

function preFill() {
    var getParams = window.location.search.substr(1).split('&')
    for (var id in getParams) {
        var param = getParams[id].split('=');
        if (param[0]) {
            $("#unsubscribeForm input#" + param[0]).val(decodeURIComponent(param[1]));
        }

    }
}

