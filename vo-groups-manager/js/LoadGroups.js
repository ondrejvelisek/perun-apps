/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var allVoGroups;

function showGroup(group) {
    if (!group) {
        (flowMessager.newMessage("group","can not be shown","warning")).draw();
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
    content += '<div class="btn-toolbar">';
        content += '<div class="btn-group">';
            content += '<button class="btn btn-success" data-toggle="modal" data-target="#createGroupIn' + 
                    group.id + '">Create Subgroup</button>';
        content += '</div>';
        content += '<div class="btn-group">';
            content += '<button class="btn btn-success" data-toggle="modal" data-target="#addMembers' + group.id + '">Add users</button>';
        content += '</div>';
        content += '<div class="btn-group">';
            content += '<button class="btn btn-success" data-toggle="modal" data-target="#addManagers' + group.id + '">Add group managers</button>';
        content += '</div>';
    content += '</div>';
    content += '<div class="membersTable"></div>';
    content += '<div class="subgroupsTable"></div>';
    
    var groupTab = new Tab(group.shortName, group.id, content)
    innerTabs.addTab(groupTab);
    
    groupTab.addContent(getCreateGroupModalHtml(group.id));
    groupTab.addContent(getSelectMembersModalHtml("addMembers", group.id));
    groupTab.addContent(getSelectMembersModalHtml("addManagers", group.id));
    
    var createGroupForm = groupTab.place.find("[id^=createGroupIn] form");
    createGroupForm.submit(function(event) {
        event.preventDefault();
        createGroup(createGroupForm, group);
    });
    
    var addMembersForm = groupTab.place.find("[id^=addMembers] form");
    addMembersForm.submit(function(event) {
        event.preventDefault();
        addMembers(addMembersForm, group);
    });
    
    var addManagersForm = groupTab.place.find("[id^=addManagers] form");
    addManagersForm.submit(function(event) {
        event.preventDefault();
        addManagers(addManagersForm, group);
    });
    
    fillSelectMembersModal(groupTab.place.find("#addMembers" + group.id + ", #addManagers" + group.id));
}

function loadGroups(vo) {
    if (!vo) {
        (flowMessager.newMessage("Groups", "can't be loaded because vo is not set.", "danger")).draw();
    }
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

function createGroup(form, group) {
    event.preventDefault();
    var name = form.find("#name");
    var description = form.find("#description");
    var newGroup = {name: name.val(), description: description.val()};
    callPerunPost("groupsManager", "createGroup", {parentGroup: group.id, group: newGroup}, function(createdGroup) {
        innerTabs.place.find("#" + group.id + " .modal").modal('hide');
        (flowMessager.newMessage(createdGroup.name, "subgroup was created succesfuly", "success")).draw();
        loadGroups(vo);
        showGroup(createdGroup);
    });
}

function addMembers(form, group) {
    var membersValues = form.find("#members").val();
    var membersIds = [];
    for(var j in membersValues) {
        membersIds.push(membersValues[j].split("-")[0]);
    }
    for(var j in membersIds) {
        callPerunPost("groupsManager", "addMember", {group: group.id, member: membersIds[j]}, function() {
            innerTabs.getTabByName(group.id).place.find(".modal").modal('hide');
            (flowMessager.newMessage("Member", "with id " + membersIds[j] + 
                    " was added sucesfuly into " + group.shortName + " group" , "success")).draw();
            showGroup(group);
        });
    }
}

function addManagers(form, group) {
    var membersValues = form.find("#members").val();
    var usersIds = [];
    for(var j in membersValues) {
        usersIds.push(membersValues[j].split("-")[1]);
    }
    debug(usersIds);
    for(var id in usersIds) {
        callPerunPost("groupsManager", "addAdmin", {group: group.id, user: usersIds[id]}, function() {
            innerTabs.getTabByName(group.id).place.find(".modal").modal('hide');
            (flowMessager.newMessage("User", "with id " + usersIds[id] + 
                    " is manager in " + group.shortName + " group now." , "success")).draw();
            showGroup(group);
        });
    }
}


function getCreateGroupModalHtml(where) {
    var html;
    html = '<div id="createGroupIn' + where + '" class="modal fade">';
    html += '  <div class="modal-dialog">';
    html += '    <div class="modal-content">';
    html += '      <div class="modal-body">';
    html += '        <p>';
    html += '          <form role="form" id="createGroup' + where + 'Form">';
    html += '            <div class="form-group">';
    html += '              <label for="name">Group name</label>';
    html += '              <input type="text" class="form-control" id="name" placeholder="Group name" autofocus>';
    html += '            </div>';
    html += '            <div class="form-group">';
    html += '              <label for="description">Description</label>';
    html += '              <input type="text" class="form-control" id="description" placeholder="Description">';
    html += '            </div>'; 
    html += '            <button type="submit" type="button" class="btn btn-success">Create Group</button>';    
    html += '          </form>';
    html += '        </p>';
    html += '      </div>';
    html += '    </div><!-- /.modal-content -->';
    html += '  </div><!-- /.modal-dialog -->';
    html += '</div><!-- /.modal -->';
    return html;
}

function getSelectMembersModalHtml(name, groupId) {
    var html;
    html = '<div id="' + name + groupId + '" class="modal fade">';
    html += '  <div class="modal-dialog">';
    html += '    <div class="modal-content">';
    html += '      <div class="modal-body">';
    html += '        <p>';
    html += '          <form role="form">';
    html += '            <div class="form-group">';
    html += '              <label for="members">Select users</label>';
    html += '              <select id="members" multiple class="form-control">';
    // loaded by fillSelectMembersModal method
    html += '              </select>';
    html += '            </div>';
    html += '            <button type="submit" type="button" class="btn btn-success">Add Group Admins</button>';    
    html += '          </form>';
    html += '        </p>';
    html += '      </div>';
    html += '    </div><!-- /.modal-content -->';
    html += '  </div><!-- /.modal-dialog -->';
    html += '</div><!-- /.modal -->';
    return html;
}

function fillSelectMembersModal(modal) {
   callPerun("membersManager", "getCompleteRichMembers", {vo: vo.id, attrsNames: ["urn:perun:member:attribute-def:def:mail"]}, function(members) {
        if (!members) {
            (flowMessager.newMessage("Members", "can't be loaded.", "danger")).draw();
            return;
        }
        
        //debug(members[0].user);
        for(var id in members) {
            var option;
            option  = '<option value="' + members[id].id + '-' + members[id].user.id + '">';
            option += members[id].user.lastName + " " + members[id].user.firstName;
            option += '</option>';
            modal.find("select#members").append(option);
        }
    });
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