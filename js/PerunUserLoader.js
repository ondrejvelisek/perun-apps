// Empty initial perunSession object
var user = {};
var userAttributesFriendly = [];

$(document).ready(function() {
    loadUser();
});


function loadUser() {
    callPerun("authzResolver", "getPerunPrincipal", {})(function(perunPrincipal) {
        if (perunPrincipal.user === null) {
            return null;
        }
        user = perunPrincipal.user;
        fillUserInfo(user);
        loadUserAttributes();
    });
}

function loadUserAttributes() {
    callPerun("attributesManager", "getAttributes", {user: user.id})(function(userAttributes) {
        if (userAttributes === null) {
            return null;
        }
        for (var attrId in userAttributes) {
            userAttributesFriendly[userAttributes[attrId].friendlyName] = userAttributes[attrId].value;
            //alert(JSON.stringify(userAttributesFriendly[userAttributes[attrId].friendlyName]));
        }
        fillUserAttributes(userAttributesFriendly);
        drawMessage(new Message("User data", "was loaded successfully.", "success"));

        entryPoint();
    });
}


function fillUserInfo(user) {
    // Fill basic info about the user
    $("#user-id").text(user.id);
    $("#user-titleBefore").text((user.titleBefore !== null) ? user.titleBefore : "");
    $("#user-firstName").text((user.firstName !== null) ? user.firstName : "");
    $("#user-middleName").text((user.middleName !== null) ? user.middleName : "");
    $("#user-lastName").text((user.lastName !== null) ? user.lastName : "");
    $("#user-titleAfter").text((user.titleAfter !== null) ? user.titleAfter : "");
}
function fillUserAttributes(userAttributesFriendly) {
    for (var attrId in userAttributesFriendly) {
        $("#user-" + attrId).text(userAttributesFriendly[attrId]);
        //alert("#user-"+attrId+" = "+userAttributesFriendly[attrId]);
    }
}