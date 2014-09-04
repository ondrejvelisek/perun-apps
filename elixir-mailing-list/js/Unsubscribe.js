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
    
    $("#unsubscribe #unsubscribeForm").submit(function(event) {
        event.preventDefault();
        
        var form = $("#unsubscribe #unsubscribeForm");
        var mailingListName = form.find("#mailingList").val();
        var email = form.find("#email").val();
        
        debug("callExternalScript("+mailingListName+", "+email+");");
        (new Message("a confirmation email", "has been sent to "+email, "success")).draw();
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


function loadUserAttributes(user) {
    if (!user) {
        (new Message("User attributes", "can't be loaded because user isn't loaded.", "danger")).draw();
        return;
    }
    var loadImage = new LoadImage($('#user-attributes [id^="user-"], #user-displayName'), "20px");

    callPerun("attributesManager", "getAttributes", {user: user.id}, function(userAttributes) {
        if (!userAttributes) {
            (new Message("User attributes", "can't be loaded.", "danger")).draw();
            return;
        }
        var userAttributesFriendly = {};
        for (var attrId in userAttributes) {
            userAttributesFriendly[userAttributes[attrId].friendlyName] = userAttributes[attrId].value;
        }
        fillUserAttributes(userAttributesFriendly);
        loadImage.hide();
        //(new Message("User data", "was loaded successfully.", "success")).draw();
    });
}


function fillUserAttributes(userAttributesFriendly) {
    if (!userAttributesFriendly) {
        (new Message("User attributes", "can't be fill.", "danger")).draw();
        return;
    }
    for (var attrName in userAttributesFriendly) {
        var attrId = attrName.split(':').join('-');
        $("#user-" + attrId).text(userAttributesFriendly[attrName]);
    }
}