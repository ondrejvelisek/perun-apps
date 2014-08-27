// Empty initial perunSession object
var user = {};
var userAttributes = [];

$(document).ready(function() {
    
    loadUser();
    // Methods which check if the Perun connection is OK
    if (configuration.TESTING_CONNECTION) {
        setTimeout(executeQuery, 5000);
    }    

});


function loadUser() {
    callPerun("authzResolver", "getPerunPrincipal", {})(function(perunPrincipal) {
        if (perunPrincipal.user === null) {
            return null;
        }
        user = perunPrincipal.user;
        callPerun("attributesManager", "getAttributes", {user: user.id})(function(userAttributesRaw) {
            if (userAttributesRaw === null) {
                return null;
            }
            for (var attrId in userAttributesRaw) {
                userAttributes[userAttributesRaw[attrId].friendlyName] = userAttributesRaw[attrId].value;
            }
            fillUserInfo();
        });
    });
}
function fillUserInfo(userAttributesRaw) {
    // Fill basic info about the user
    $("#user-id").text(user.id);
    $("#user-titleBefore").text((user.titleBefore !== null) ? user.titleBefore : "");
    $("#user-firstName").text((user.firstName !== null) ? user.firstName : "");
    $("#user-middleName").text((user.middleName !== null) ? user.middleName : "");
    $("#user-lastName").text((user.lastName !== null) ? user.lastName : "");
    $("#user-titleAfter").text((user.titleAfter !== null) ? user.titleAfter : "");
    // Fill basic info about the user attributes
    $("#user-displayName").text(userAttributes.displayName);
    $("#user-organization").text(userAttributes.organization);
    $("#user-workplace").text(userAttributes.workplace);
    $("#user-preferredMail").text(userAttributes.preferredMail);
    $("#user-phone").text(userAttributes.phone);
    $("#user-login").text(userAttributes['login-namespace:einfra']);
    $("#user-preferredLanguage").text(userAttributes.preferredLanguage);
}




function reloadMsg() {
    alert("Data connection lost. Click OK to relad the page.");
    window.location.reload();
}

function executeQuery() {
        $.ajax({
            url: configuration.TEST_RPC_URL,
            success: function(data) {
                if (!data.startsWith("OK!")) {
                    reloadMsg();
                }
                setTimeout(executeQuery, 5000);
            },
            statusCode: {
                404: function() {
                    reloadMsg();
                },
                401: function() {
                    reloadMsg();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                reloadMsg();
            }
        });
    
}