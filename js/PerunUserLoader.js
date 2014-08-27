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
        callPerun("attributesManager", "getAttributes", {user: user.id})(function(userAttributesRaw) {
            if (userAttributesRaw === null) {
                return null;
            }
            for (var attrId in userAttributesRaw) {
                userAttributes[userAttributesRaw[attrId].friendlyName] = userAttributesRaw[attrId].value;
            }
            fillUserAttributes(userAttributes);
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
    // Fill basic info about the user attributes
    $("#user-displayName").text(userAttributes.displayName);
    $("#user-organization").text(userAttributes.organization);
    $("#user-workplace").text(userAttributes.workplace);
    $("#user-preferredMail").text(userAttributes.preferredMail);
    $("#user-phone").text(userAttributes.phone);
    $("#user-login").text(userAttributes['login-namespace:einfra']);
    $("#user-preferredLanguage").text(userAttributes.preferredLanguage);
}