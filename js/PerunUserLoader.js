// Empty initial perunSession object
var user;

$(document).ready(function() {
    loadUser();
});


function loadUser() {
    callPerun("authzResolver", "getPerunPrincipal", {}, function(perunPrincipal) {
        if (!perunPrincipal) {
            (flowMessager.newMessage("User","can't be loaded.","danger")).draw();
            return;
        }
        user = perunPrincipal.user;
        fillUserInfo(user);
        entryPoint(user);
    });
}

function fillUserInfo(user) {
    if (!user) {
        (flowMessager.newMessage("User info","can't be fill because user isn't loaded.","danger")).draw();
        return;
    }
    $("#user-id").text(user.id);
    $("#user-titleBefore").text((user.titleBefore !== null) ? user.titleBefore : "");
    $("#user-firstName").text((user.firstName !== null) ? user.firstName : "");
    $("#user-middleName").text((user.middleName !== null) ? user.middleName : "");
    $("#user-lastName").text((user.lastName !== null) ? user.lastName : "");
    $("#user-titleAfter").text((user.titleAfter !== null) ? user.titleAfter : "");
}
