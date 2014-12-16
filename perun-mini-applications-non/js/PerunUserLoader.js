// Empty initial perunSession object
var user;
var roles;

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
        roles = perunPrincipal.roles;
        fillUserInfo(user);
        fillRolesInfo(roles);
        entryPoint(user);
    });
}

function fillUserInfo(user) {
    if (!user) {
        (flowMessager.newMessage("User info","can't be fill because user isn't loaded.","danger")).draw();
        return;
    }
    $("#user-id").text(user.id);
    $("#user-titleBefore").text((user.titleBefore) ? user.titleBefore : "");
    $("#user-firstName").text((user.firstName) ? user.firstName : "");
    $("#user-middleName").text((user.middleName) ? user.middleName : "");
    $("#user-lastName").text((user.lastName) ? user.lastName : "");
    $("#user-titleAfter").text((user.titleAfter) ? user.titleAfter : "");
}

function fillRolesInfo(roles) {
    if (!roles) {
        (flowMessager.newMessage("Roles info","can't be fill because roles aren't loaded.","danger")).draw();
        return;
    }
    $("#user-roles").html("");
    for(var i in roles) {
        var item;
        switch(i) {
            case "PERUNADMIN":
                item = "<b>Perun Admin</b> ";
            break;
            case "VOOBSERVER":
                item = "<b>VO Observer:</b> ";
                for(var j in this.roles[i].Vo) {
                    item += this.roles[i].Vo[j];
                }
            break;
            case "VOADMIN":
                item = "<b>VO Admin:</b> ";
                for(var j in this.roles[i].Vo) {
                    item += this.roles[i].Vo[j];
                }
            break;
            case "TOPGROUPCREATOR":
                item = "<b>Top Group Creator:</b> ";
                for(var j in this.roles[i].Vo) {
                    item += this.roles[i].Vo[j];
                }
            break;
            case "GROUPADMIN":
                item = "<b>Group Admin:</b> ";
                for(var j in this.roles[i].Group) {
                    item += this.roles[i].Group[j];
                }
            break;
            default:
                item = "";
            break;
        }
        $("#user-roles").append("<li>" + item + "</li>");
    }
}

function logout() {
    callPerun("utils", "logout", {}, function(logout) {
        $(".user [data-toggle=dropdown]").hide();
        $(".user #login").show();
        (staticMessager.newMessage("User","was logged out successfully","success")).draw();
        callBackAfter("logout");
    });
}
