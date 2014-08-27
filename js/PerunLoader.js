// Empty initial perunSession object
var perunSession = {};
var user = {};
var userAttributes = [];

$(document).ready(function(){

     // Get PerunSession
     callPerunSync("authzResolver", "getPerunPrincipal", perunSession);
     // Extract user object
     user = perunSession.user;
     // Get all user attributes
     userAttributesRaw = {};
     callPerunSync("attributesManager", "getAttributes", userAttributesRaw, { user : user.id });
     for (attrId in userAttributesRaw) {
        userAttributes[userAttributesRaw[attrId].friendlyName] = userAttributesRaw[attrId].value; 
     }

     // Fill basic info about the user
     $("#user-firstName").text(user.firstName);
     $("#user-lastName").text(user.lastName);
     $("#user-organization").text(userAttributes.organization);
     $("#user-preferredMail").text(userAttributes.preferredMail);
     $("#user-phone").text(userAttributes.phone);
     $("#user-preferredLanguage").text(userAttributes.preferredLanguage);
     $("#user-login").text(userAttributes['login-namespace:einfra']);
     if (userAttributes['timezone']) {
	     $("#user-timezone").text(userAttributes['timezone']);
     } else {
	     $("#user-timezone").text("not set");
     }

    // Methods which check if the Perun connection is OK
    setTimeout(executeQuery, 5000);
    function reloadMsg() {
        alert("Data connection lost. Click OK to relad the page.");
        window.location.reload();  
    }

    function executeQuery() {
      $.ajax({
        url: Configuration.TEST_RPC_URL,
        success: function(data) {
           if (!data.startsWith("OK!")) {
            reloadMsg();
           }
          setTimeout(executeQuery, 5000);
        },
        statusCode:{
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
});
