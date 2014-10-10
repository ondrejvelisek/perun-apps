/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var allVoGroups;

function showGroup(group) {
    if (!group) {
        return;
    }
    if (!innerTabs.containsTab(group.id)) {
        if (innerTabs.containsTab(group.parentGroupId)) {
            innerTabs.removeSuccessors(group.parentGroupId);
        } else {
            if (group.parentGroupId) {
                showGroup(getGroupById(allVoGroups, group.parentGroupId));
            } else {
                innerTabs.removeSuccessors("vo");
            }
        }
        addGroupTab(group);
    }
    innerTabs.show(group.id);
    $('#group-name').text(group.name);
    $('#groupLink > span').text(group.shortName);
    loadMembers(group);
}

function addGroupTab(group) {
    var content = '<div class="page-header"><h2>' + group.name + '</h2></div>';
    content += '<div class="membersTable"></div>';
    content += '<div class="subgroupsTable"></div>';
    innerTabs.addTab(new Tab(group.shortName, group.id, content));
}

function loadGroups(vo) {
    var loadImage = new LoadImage($('#groupsTable'), "20px");
    callPerun("groupsManager", "getGroups", {vo: vo.id}, function(groups) {
        if (!groups) {
            (flowMessager.newMessage("Groups", "can't be loaded.", "danger")).draw();
            return;
        }
        //var topLevelGroups = filterTopLevelGroups(groups);
        allVoGroups = groups;
        fillGroups(groups);
        loadImage.hide();
    });
}



function fillGroups(groups) {
    if (!groups) {
        (flowMessager.newMessage("Groups", "can't be fill.", "danger")).draw();
        return;
    }
    
    var table = $("#groupsTable");
    
    table.html(getTableOfGroups(groups).draw());
    
    table.find('[data-toggle="tooltip"]').tooltip();
    
    table.find("table tr").click(function () {
        var group = getGroupById(groups, $(this).attr("id").split("-")[1]);
        showGroup(group);
    });
    
    
}

function getTableOfGroups(groups) {  
    
    createTableNameAttr(groups);
    
    var groupsTable = new PerunTable();
    groupsTable.setClicableRows({isClicable : true, id:"id", prefix:"row-"});
    groupsTable.addColumn({type: "number", title: "#"});
    //groupsTable.addColumn({type: "button", title: "", btnText: "⌄", btnType: "default", btnId: "id"});
    groupsTable.addColumn({type: "text", title: "Name", name: "tableName"});
    groupsTable.addColumn({type: "text", title: "Description", name: "description"});
    groupsTable.setValues(groups);
    
    return groupsTable;
}


function createTableNameAttr(groups) {
    for (var id in groups) {
        if (groups[id].parentGroupId === null) {
            groups[id].tableName = groups[id].shortName;
        } else {
            var level = groups[id].name.split(":").length - 1;
            groups[id].tableName = "";
            for (var i = 0; i < level; i++) {
                groups[id].tableName += "<span class='space'> </span>";
            }
            groups[id].tableName += groups[id].shortName;
        }
    }
    return groups;
}



function getGroupById(groups, id) {
    for (var i in groups) {
        if (groups[i].id == id) {
            return groups[i];
        }
    }
    return null;
}







/*

function getAllSubgroups(groups) {
    var subgroups = [];
    for (var id in groups) {
        if (groups[id].parentGroupId !== null) {
            subgroups.push(groups[id]);
        }
    }
    return subgroups;
}

function loadSubgroups(group) {
    callPerun("groupsManager", "getSubGroups", {parentGroup: group.id}, function(subgroups) {
        if (!subgroups) {
            (flowMessager.newMessage("Subgroups", "can't be loaded.", "danger")).draw();
            return;
        }
        fillSubgroups(subgroups, group);
    });
}


function fillSubgroups(subgroups, parentGroup) {
    if (!subgroups) {
        (flowMessager.newMessage("Subgroups", "can't be fill.", "danger")).draw();
        return;
    }
    
    var table = $("#"+parentGroup.id+" .subgroupsTable");
    
    if (subgroups.length == 0) {
        table.html("no subgroups");
        return;
    }
    
    table.html(getTableOfGroups(subgroups).draw());
    
    table.find('[data-toggle="tooltip"]').tooltip();
    
    table.find("table tr").click(function () {
        var group = getGroupById(subgroups, $(this).attr("id").split("-")[1]);
        showGroup(group);
    });
}*/