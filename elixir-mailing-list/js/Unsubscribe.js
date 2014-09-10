/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function entryPoint(user) {
    //loadUserAttributes(user);
}

$(document).ready(function() {
    preFill();
    
    $("#unsubscribeForm").submit(function(event) {
        event.preventDefault();
        
        var email = $("#unsubscribeForm input#email").val();
        
        callExternalScript("http://perun.metacentrum.cz/cgi-perun/sendVerificationEmail.cgi", {email: email}, function(data) {
            (new Message("a confirmation email", "has been sent to "+email, "success")).draw();
        });
        
    });

    var hash = document.location.hash.substring(1);
    if (hash === "confirm") {
        (new Message("success", "lorem ipsum", "success", $("#confirm"))).draw();
        (new Message("error", "lorem ipsum", "danger", $("#confirm"))).draw();
    }

});

function preFill() {
    var getParams = window.location.search.substr(1).split('&')
    for (var id in getParams) {
        var param = getParams[id].split('=');
        if (param[0]) {
            $("#form input#" + param[0]).val(decodeURIComponent(param[1]));
        }
        
    }
}

function callExternalScript(url, args, callBack) {
    debug(args);
    $.ajax({
        url: url,
        data: args,
        dataType: "jsonp",
        type: "get",
        success: function(data, textStatus, jqXHR)
        {
            if (!data) {
                callBack();
            } else if (typeof data.errorId !== "undefined") {
                (new Message(data.name, data.message, "danger")).draw();
            } else {
                callBack(data);
            }
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            (new Message(errorThrown, textStatus, "danger")).draw();
        }
    });
}
;