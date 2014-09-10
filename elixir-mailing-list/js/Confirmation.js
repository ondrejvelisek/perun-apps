/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function() {

    var urlParams = {};
    var urlSearch = window.location.search.substring(1).split('&');
    for (var id in urlSearch) {
        urlParams[urlSearch[id].split('=')[0]] = urlSearch[id].split('=')[1];
    }

    callExternalScript("https://perun.metacentrum.cz/cgi-perun/removeUserFromMailingList.cgi", {secret: urlParams.secret}, function(data) {
        if (data.errorId) {
            switch (data.name) {
                case "MemberNotExistsException":
                    (new Message("You are not a member of mailing list info@elixir-czech.cz", "So we can not unsubscribe you.", "danger", $("#messager"), false)).draw();
                    break;
                case "UserNotFoundByEmailException":
                    (new Message("You are not a member of mailing list info@elixir-czech.cz", "So we can not unsubscribe you.", "danger", $("#messager"), false)).draw();
                    break;
                case "TimestampExceetedMaxAgeException":
                    (new Message("Link has expired", "Please apply on <a href='index.html'>Elixir mailing list Manager</a>", "danger", $("#messager"), false)).draw();
                    break;
                case "AlreadyRemovedException":
                    (new Message("User was already removed", "from mailing list info@elixir-czech.cz", "danger", $("#messager"), false)).draw();
                    break;
                default :
                    (new Message("Internal error", "Please, try it later. If problem still persists contact support@elixir-czech.cz"
                            + " and attach this error number: " + data.errorId, "danger", $("#messager"), false)).draw();
                    break;
            }
        } else {
            (new Message("Your email was successfully unsubscribed", "from mailing list info@elixir-czech.cz", "success", $("#messager"), false)).draw();
        }
    });

});