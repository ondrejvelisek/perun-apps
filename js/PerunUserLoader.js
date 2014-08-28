// Empty initial perunSession object
var user = {};
var userAttributes = [];

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
        callPerun("attributesManager", "getAttributes", {user: user.id})(function(userAttrs) {
            if (userAttrs === null) {
                return null;
            }
            userAttributes = userAttrs;
            fillUserAttributes(userAttributes);
            drawMessage(new Message("User data","was loaded successfully.","success"));

            entryPoint();
        });
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
function fillUserAttributes(userAttributes) {
    for (var attrId in userAttributes) {
        $("#user-"+userAttributes[attrId].friendlyName).text(userAttributes[attrId].value);
        //alert("#user-"+userAttributes[attrId].friendlyName+" = "+userAttributes[attrId].value);
    }
}