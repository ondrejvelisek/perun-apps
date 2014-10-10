/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



function loadMembers(group) {
    var loadImage = new LoadImage($('.membersTable'), "64px");
    callPerun("membersManager", "getCompleteRichMembers", {group: group.id, lookingInParentGroup: 0}, function(members) {
        if (!members) {
            (flowMessager.newMessage("Subgroups", "can't be loaded.", "danger")).draw();
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
    
    var table = $("#"+group.id+" .membersTable");
    
    if (members.length == 0) {
        table.html("no members");
        return;
    }
    
    var users = [];
    for(var id in members) {
        users.push(members[id].user);
    }
    
    var membersTable = new PerunTable();
    //membersTable.setClicableRows({isClicable : true, id:"id", prefix:"row-"});
    membersTable.addColumn({type: "number", title: "#"});
    membersTable.addColumn({type: "text", title: "Name", name: "firstName"});
    membersTable.addColumn({type: "text", title: "Last", name: "lastName"});
    membersTable.setValues(users);
    table.html(membersTable.draw());
    
    table.find('[data-toggle="tooltip"]').tooltip();
    
    table.find("table tr").click(function () {
        var group = getGroupById(subgroups, $(this).attr("id").split("-")[1]);
        showGroup(group);
    });
}