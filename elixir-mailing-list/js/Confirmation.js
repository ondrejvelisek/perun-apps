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
        if (data.errorId !== "undefined") {
            switch (data.name) {
                case "MemberNotExistsException":
                    (new Message("nejste členem mailing listu info@elixir-czech.cz", "tak vás nejde odhlásit", "danger", $("#messager"), false)).draw();
                    break;
                case "UserNotFoundByEmailException":
                    (new Message("nejste členem mailing listu info@elixir-czech.cz", "tak vás nejde odhlásit", "danger", $("#messager"), false)).draw();
                    break;
                case "TimestampExceetedMaxAgeException":
                    (new Message("platnost odkazu vypršela, zažádejte znovu na adrese", "...", "danger", $("#messager"), false)).draw();
                    break;
                default :
                    (new Message("interní", "support@elixir-czech.cz", "danger", $("#messager"), false)).draw();
                    break;
            }
        } else {
            (new Message(data.name, data.message, "success", $("#messager"), false)).draw();
        }
    });

});