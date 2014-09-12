/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {
    var form = $("#unsubscribeForm");
    preFill(form);

    form.submit(function(event) {
        event.preventDefault();

        var email = form.find("input#email");
        var submit = form.find("[type=submit]");
        submit.prop( "disabled", true );
        
        callExternalScript("sendUnsubscribeEmail.cgi", {email: email.val()}, function(data) {
            submit.prop( "disabled", false );
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
                email.val("");
                (new Message("a confirmation email", "has been sent to " + email.val(), "success")).draw();
            }

        });

    });

});
