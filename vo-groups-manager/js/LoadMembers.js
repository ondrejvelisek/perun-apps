/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



function loadMembers(group) {
    var loadImage = new LoadImage($("#" + group.id + " .membersTable"), "64px");
    callPerun("membersManager", "getCompleteRichMembers", {group: group.id,
        attrsNames: ["urn:perun:user:attribute-def:core:displayName", "urn:perun:user:attribute-def:def:preferredMail"],
        lookingInParentGroup: 0},
    function (members) {
        if (!members) {
            (flowMessager.newMessage("Members", "can't be loaded.", "danger")).draw();
            return;
        }
        fillMembers(members, group);
        loadImage.hide();
    });
}

var allMembers;
function loadAllMembers(vo) {
    callPerun("membersManager", "getCompleteRichMembers", {vo: vo.id, attrsNames: ["urn:perun:user:attribute-def:def:preferredMail"]}, function (members) {
        if (!members) {
            return;
        }
        allMembers = members.sort(compareMembers);
        callBackAfter(loadAllMembers);
    });
}

/*var users;
 function loadAllUsers(vo) {
 callPerun("membersManager", "getCompleteRichMembers", {vo: vo.id, attrsNames: ["urn:perun:member:attribute-def:def:mail"]}, function(members) {
 if (!members) {
 (flowMessager.newMessage("Members", "can't be loaded.", "danger")).draw();
 return;
 }
 users = [];
 for(var id in members) {
 users.push(members[id].user);
 }
 });
 }*/

function fillMembers(members, group) {
    if (!members) {
        (flowMessager.newMessage("Members", "can't be fill.", "danger")).draw();
        return;
    }

    var table = $("#" + group.id + " .membersTable");

    if (members.length == 0) {
        table.html("no members");
        return;
    }

    var users = [];
    for (var i in members) {
        users[i] = members[i].user;
        var attrs = members[i].userAttributes;
        for (var j in attrs) {
            users[i][attrs[j].friendlyName] = attrs[j].value;
        }
    }

    var membersTable = new PerunTable();
    //membersTable.setClicableRows({isClicable : true, id:"id", prefix:"row-"});
    //membersTable.addColumn({type: "number", title: "#"});
    membersTable.addColumn({type: "text", title: "Name", name: "displayName"});
    membersTable.addColumn({type: "text", title: "Preferred Mail", name: "preferredMail"});
    membersTable.setValues(users);
    table.html(membersTable.draw());
}



function compareMembers(a, b) {
    return a.user.lastName.localeCompare(b.user.lastName);
}



function getAttrByFriendlyName(attrs, friendlyName) {
    for (var i in attrs) {
        if (attrs[i].friendlyName == friendlyName) {
            return attrs[i];
        }
    }
}