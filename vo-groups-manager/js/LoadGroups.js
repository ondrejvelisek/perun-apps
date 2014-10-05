/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function loadGroups(vo) {
    callPerun("groupsManager", "getGroups", {vo: vo.id}, function(groups) {
        if (!groups) {
            (flowMessager.newMessage("Groups", "can't be loaded.", "danger")).draw();
            return;
        }
        fillGroups(groups);
    });
}

function fillGroups(groups) {
    if (!groups) {
        (flowMessager.newMessage("Groups", "can't be fill.", "danger")).draw();
        return;
    }
    
    var topLevelGroups = filterTopLevelGroups(groups);
    //debug(topLevelGroups);
    
    var groupsTable = new PerunTable();
    groupsTable.setClicableRows({isClicable : true, id:"id", prefix:"row-"});
    groupsTable.addColumn({type: "number", title: "#"});
    groupsTable.addColumn({type: "icon", title: "", name: "subgroupIcon", description:"has subgroups"});
    groupsTable.addColumn({type: "text", title: "Name", name: "name"});
    groupsTable.addColumn({type: "text", title: "Description", name: "description"});
    groupsTable.setValues(topLevelGroups);
    var tableHtml = groupsTable.draw();
    $("#groupsTable").html(tableHtml);
    
    $('[data-toggle="tooltip"]').tooltip();
    
    $("#groupsTable table tr").click(function () {
        debug("Group id = "+$(this).attr("id"));
    });
}

function filterTopLevelGroups(groups) {
    var topLevelGroups = [];
    for (var id in groups) {
        if (groups[id].parentGroupId === null) {
            topLevelGroups.push(groups[id]);
        } else {
            getGroupById(groups, groups[id].parentGroupId).subgroupIcon = "icon-users";
        }
    }
    return topLevelGroups;
}

function getGroupById(groups, id) {
    for (var i in groups) {
        if (groups[i].id === id) {
            return groups[i];
        }
    }
    return null;
}