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
        users[i].memberId = members[i].id;
        if (members[i].membershipType == "DIRECT") {
            users[i].membershipTypeIcon = "glyphicon-ok";
        } else {
            users[i].membershipTypeIcon = "glyphicon-minus";
        }
        var attrs = members[i].userAttributes;
        for (var j in attrs) {
            users[i][attrs[j].friendlyName] = attrs[j].value;

        }
    }

    var membersTable = new PerunTable();
    //membersTable.setClicableRows({isClicable : true, id:"id", prefix:"row-"});
    //membersTable.addColumn({type: "number", title: "#"});
    membersTable.addColumn({type: "icon", title: "", name: "membershipTypeIcon", description: "is direct member"});
    membersTable.addColumn({type: "text", title: "Name", name: "displayName"});
    membersTable.addColumn({type: "text", title: "Preferred Mail", name: "preferredMail"});
    membersTable.addColumn({type: "button", title: "", btnText: "&times;", btnId: "memberId", btnName: "removeMember", btnType: "danger"});
    membersTable.setValues(users);
    table.html(membersTable.draw());

    table.find('[data-toggle="tooltip"]').tooltip();
    table.find('button[id^=removeMember]').click(function () {
        var member = getMemberById(members, $(this).attr("id").split("-")[1]);
        
        callPerunPost("groupsManager", "removeMember", {group: group.id, member: member.id},
        function () {
            (flowMessager.newMessage(member.name, "was removed sucesfuly from " + group.shortName + " group", "success")).draw();
            showGroup(group.id);
            refreshAllParentsMembers(group);
        }, function (error) {
            switch (error.name) {
                case "NotGroupMemberException":
                    (flowMessager.newMessage(member.name, "is not in group " + group.shortName, "warning")).draw();
                    break;
                default:
                    (flowMessager.newMessage("Internal error", "Can not remove member " + member.name + " from group " + group.shortName, "danger")).draw();
                    break;
            }
        });
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

function getMemberById(members, id) {
    for (var i in members) {
        if (members[i].id == id) {
            return members[i];
        }
    }
    return null;
}

function refreshAllParentsMembers(group) {
    if (!group.parentGroupId) {
        return;
    }
    var parentGroup = getGroupById(allVoGroups, group.parentGroupId);
    if (!parentGroup) {
        return;
    }
    loadMembers(parentGroup);
    refreshAllParentsMembers(parentGroup);
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