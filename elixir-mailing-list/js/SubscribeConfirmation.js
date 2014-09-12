/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function() {

    var secret = getURLParameter("secret");

    callExternalScript("subscribe.cgi", {secret: secret}, function(data) {
        if (data.errorId) {
            switch (data.name) {
                case "MemberNotExistsException":
                    (new Message("You are not a member of mailing list info@elixir-czech.cz", "So we can not unsubscribe you.", "danger", $("#messager"), false)).draw();
                    break;
                case "UserNotFoundByEmailException":
                    (new Message("You are not a member of mailing list info@elixir-czech.cz", "So we can not unsubscribe you.", "danger", $("#messager"), false)).draw();
                    break;
                case "TimestampExceetedMaxAgeException":
                    (new Message("Link has expired", "Please continue to <a href='subscribe.html'>Elixir mailing list Manager</a> and send a new subscription request", "danger", $("#messager"), false)).draw();
                    break;
                case "AlreadyMemberException":
                    (new Message("User is already subscribed", "to mailing list info@elixir-czech.cz", "success", $("#messager"), false)).draw();
                    break;
                default :
                    (new Message("Internal error", "Please, try it later. If problem still persists contact support@elixir-czech.cz"
                            + " and attach this error number: " + data.errorId, "danger", $("#messager"), false)).draw();
                    break;
            }
        } else {
            (new Message("Your email was successfully subscribed", "to mailing list info@elixir-czech.cz", "success", $("#messager"), false)).draw();
        }
    });

});
