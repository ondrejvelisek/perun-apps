/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function showGroup(group) {
    if (!group) {
        (flowMessager.newMessage("group","can not be shown","warning")).draw();
        return;
    }
    
    //if (!innerTabs.containsTab(group.id)) {
    if (innerTabs.containsTab(group.parentGroupId)) {
        innerTabs.removeSuccessors(group.parentGroupId);
    } else {
        var parentGroup = getGroupById(allVoGroups, group.parentGroupId);
        if (parentGroup) {
            showGroup(parentGroup);
        } else {
            innerTabs.removeSuccessors("vo");
        }
    }
    addGroupTab(group);
    //}
    innerTabs.show(group.id);
    $('#group-name').text(group.name);
    //$('#groupLink > span').text(group.shortName);
    loadMembers(group);
}

function addGroupTab(group) {
    var groupTab = new Tab(group.shortName, group.id);
    innerTabs.addTab(groupTab);
    
    var content;
    content  = '<div class="page-header"><h2>' + group.name + '</h2></div>';
    content += '<div class="btn-toolbar">';
    content += '  <div class="btn-group">';
    content += '    <button class="btn btn-primary" data-toggle="modal" data-target="#addMembers' + group.id + '">Add Members</button>';
    content += '    <button class="btn btn-danger" data-toggle="modal" data-target="#removeMembers' + group.id + '">Remove Members</button>';
    content += '  </div>';
    content += '  <div class="btn-group">';
    content += '    <button class="btn btn-primary" data-toggle="modal" data-target="#addManagers' + group.id + '">Add Managers</button>';
    content += '    <button class="btn btn-danger" data-toggle="modal" data-target="#removeManagers' + group.id + '">Remove Managers</button>';
    content += '  </div>';
    content += '  <div class="btn-group pull-right">';
    content += '    <button class="btn btn-primary" data-toggle="modal" data-target="#createGroup' + group.id + '">Create Subgroup</button>';
    content += '    <button class="btn btn-danger" data-toggle="modal" data-target="#deleteGroup' + group.id + '">Delete Group</button>';
    content += '  </div>';
    content += '</div>';
    content += '<div class="membersTable"></div>';
    groupTab.addContent(content);
    
    var groupAuthz = new Authorization(roles, vo, group);
    var buttons = groupTab.place.find('.btn-toolbar');
    groupAuthz.addObject(buttons.find('button[data-target^=#createGroup]'), ["PERUNADMIN", "VOADMIN", "GROUPADMIN"]);
    groupAuthz.addObject(buttons.find('button[data-target^=#addMembers]'), ["PERUNADMIN", "VOADMIN", "GROUPADMIN"]);
    groupAuthz.addObject(buttons.find('button[data-target^=#addManagers]'), ["PERUNADMIN", "VOADMIN", "GROUPADMIN"]);
    groupAuthz.addObject(buttons.find('button[data-target^=#removeMembers]'), ["PERUNADMIN", "VOADMIN", "GROUPADMIN"]);
    groupAuthz.addObject(buttons.find('button[data-target^=#removeManagers]'), ["PERUNADMIN", "VOADMIN", "GROUPADMIN"]);
    groupAuthz.addObject(buttons.find('button[data-target^=#deleteGroup]'), ["PERUNADMIN", "VOADMIN", "GROUPADMIN"]);
    groupAuthz.addObject(groupTab.place.find('.membersTable'), ["PERUNADMIN", "VOOBSERVER", "VOADMIN", "GROUPADMIN", "TOPGROUPCREATOR"]);
    groupAuthz.check();
    
    var createGroupModal = new Modal("Create Subgroup in " + group.shortName, "createGroup" + group.id, groupTab.place);
    createGroupModal.init();
    fillModalCreateGroup(createGroupModal, vo, group);
    
    var addMembersModal = new Modal("Add Members to group " + group.shortName, "addMembers" + group.id, groupTab.place);
    addMembersModal.init();
    fillModalAddUsers(addMembersModal, vo, group);
    
    var addManagersModal = new Modal("Add Managers for group " + group.shortName, "addManagers" + group.id, groupTab.place);
    addManagersModal.init();
    fillModalAddManagers(addManagersModal, vo, group);
    
    var removeMembersModal = new Modal("Remove Members from group " + group.shortName, "removeMembers" + group.id, groupTab.place);
    removeMembersModal.init();
    fillModalRemoveUsers(removeMembersModal, group);
    
    var removeManagersModal = new Modal("Remove Managers for group " + group.shortName, "removeManagers" + group.id, groupTab.place);
    removeManagersModal.init();
    fillModalRemoveManagers(removeManagersModal, group);
    
    var deleteGroupModal = new Modal("Delete group " + group.shortName, "deleteGroup" + group.id, groupTab.place);
    deleteGroupModal.setType("danger");
    deleteGroupModal.init();
    fillModalDeleteGroup(deleteGroupModal, group);
}

var allVoGroups;
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
    
    createAttrTableName(groups);
    
    var groupsTable = new PerunTable();
    groupsTable.setClicableRows({isClicable : true, id:"id", prefix:"row-"});
    //groupsTable.addColumn({type: "number", title: "#"});
    //groupsTable.addColumn({type: "button", title: "", btnText: "⌄", btnType: "default", btnId: "id"});
    groupsTable.addColumn({type: "text", title: "Name", name: "tableName"});
    groupsTable.addColumn({type: "text", title: "Description", name: "description"});
    groupsTable.setValues(groups);
    
    return groupsTable;
}


function createAttrTableName(groups) {
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
    var members = [];
    for(var j in membersValues) {
        members[j] = {};
        members[j].id = membersValues[j].split("-")[0];
        members[j].userId = membersValues[j].split("-")[1];
        members[j].name = membersValues[j].split("-")[2];
    }
    for(var j in members) {
        callPerunPost("groupsManager", "addMember", {group: group.id, member: members[j].id}, function() {
            innerTabs.getTabByName(group.id).place.find(".modal").modal('hide');
            (flowMessager.newMessage(members[j].name, "was added sucesfuly into " + group.shortName + " group" , "success")).draw();
            showGroup(group);
        });
    }
}

function addManagers(form, group) {
    var membersValues = form.find("#members").val();
    var members = [];
    for(var j in membersValues) {
        members[j] = {};
        members[j].id = membersValues[j].split("-")[0];
        members[j].userId = membersValues[j].split("-")[1];
        members[j].name = membersValues[j].split("-")[2];
    }
    for(var id in members) {
        callPerunPost("groupsManager", "addAdmin", {group: group.id, user: members[id].userId}, function() {
            innerTabs.getTabByName(group.id).place.find(".modal").modal('hide');
            (flowMessager.newMessage(members[id].name, "is manager in " + group.shortName + " group now." , "success")).draw();
            showGroup(group);
        });
    }
}

function removeMembers(form, group) {
    var membersValues = form.find("#members").val();
    var members = [];
    for(var j in membersValues) {
        members[j] = {};
        members[j].id = membersValues[j].split("-")[0];
        members[j].userId = membersValues[j].split("-")[1];
        members[j].name = membersValues[j].split("-")[2];
    }
    for(var j in members) {
        callPerunPost("groupsManager", "removeMember", {group: group.id, member: members[j].id}, function() {
            innerTabs.getTabByName(group.id).place.find(".modal").modal('hide');
            (flowMessager.newMessage(members[j].name, "was removed sucesfuly from " + group.shortName + " group" , "success")).draw();
            showGroup(group);
        });
    }
}

function removeManagers(form, group) {
    var membersValues = form.find("#members").val();
    var members = [];
    for(var j in membersValues) {
        members[j] = {};
        members[j].id = membersValues[j].split("-")[0];
        members[j].userId = membersValues[j].split("-")[1];
        members[j].name = membersValues[j].split("-")[2];
    }
    for(var id in members) {
        callPerunPost("groupsManager", "removeAdmin", {group: group.id, user: members[id].userId}, function() {
            innerTabs.getTabByName(group.id).place.find(".modal").modal('hide');
            (flowMessager.newMessage(members[id].name, "is not manager in " + group.shortName + " group now." , "success")).draw();
            showGroup(group);
        });
    }
}

function deleteGroup(group) {
    callPerunPost("groupsManager", "deleteGroup", {group: group.id}, function() {
        innerTabs.getTabByName(group.id).place.find(".modal").modal('hide');
        (flowMessager.newMessage(group.name , "was deleted successfully" , "success")).draw();
        loadGroups(vo);
        if (group.parentGroupId) {
            showGroup(getGroupById(allVoGroups, group.parentGroupId));
        } else {
            showVo();
        }        
    });
}


function fillModalCreateGroup(modal, vo, group) {
    modal.clear();
    
    var html;
    html  = '          <form role="form">';
    html += '            <div class="form-group">';
    html += '              <label for="name">Group name</label>';
    html += '              <input type="text" class="form-control" id="name" placeholder="Group name" autofocus>';
    html += '            </div>';
    html += '            <div class="form-group">';
    html += '              <label for="description">Description</label>';
    html += '              <input type="text" class="form-control" id="description" placeholder="Description">';
    html += '            </div>';
    html += '            <button type="submit" class="btn btn-primary">Create Group</button>';  
    html += '          </form>';
    modal.addBody(html);
    
    var createGroupForm = modal.self.find("form");
    createGroupForm.submit(function(event) {
        event.preventDefault();
        if (group) {
            createGroup(createGroupForm, group);
        } else {
            createGroupInVo(createGroupForm, vo);
        }
    });
}

function fillModalAddUsers(modal, vo, group) {
    modal.clear();
    
    var loadImage = new LoadImage(modal.self.find(".modal-body"), "64px");
    if (!allMembers) {
        //(flowMessager.newMessage("Members", "can't be loaded.", "warning")).draw();
        callMeAfterLoadAllMembers(fillModalAddUsers, [modal, vo, group]);
        return;
    }
    loadImage.hide();
    
    if (allMembers.length === 0) {
        (new Message("", "No users found", "warning", modal.self.find(".modal-body"))).draw();
        return;
    }

    var html;
    html  = '   <form role="form">';
    html += '      <div class="form-group">';
    html += '         <label for="members">Select users</label>';
    html += '         <select id="members" multiple class="form-control">';
    html += '         </select>';
    html += '      </div>';
    html += '      <button type="submit" class="btn btn-primary">Add Members</button>';
    html += '   </form>';
    modal.addBody(html);

    var select = modal.self.find("select#members");
    for(var id in allMembers) {
        var option;
        option  = '<option value="' + allMembers[id].id + '-' + 
                allMembers[id].user.id + '-' + 
                allMembers[id].user.firstName + ' ' + allMembers[id].user.lastName + '">';
        option += allMembers[id].user.lastName + " " + allMembers[id].user.firstName;
        option += '</option>';
        select.append(option);
    }

    var addMembersForm = modal.self.find("form");
    addMembersForm.submit(function(event) {
        event.preventDefault();
        addMembers(addMembersForm, group);
    });
}

function fillModalAddManagers(modal, vo, group) {
    modal.clear();
    
    var loadImage = new LoadImage(modal.self.find(".modal-body"), "64px");
    if (!allMembers) {
        callMeAfterLoadAllMembers(fillModalAddManagers, [modal, vo, group]);
        return;
    }
    loadImage.hide();
    
    if (allMembers.length === 0) {
        (new Message("", "No users found", "warning", modal.self.find(".modal-body"))).draw();
        return;
    }

    var html;
    html  = '          <form role="form">';
    html += '            <div class="form-group">';
    html += '              <label for="members">Select users</label>';
    html += '              <select id="members" multiple class="form-control">';
    html += '              </select>';
    html += '            </div>';  
    html += '            <button type="submit" class="btn btn-primary">Add Managers</button>';
    html += '          </form>';
    modal.addBody(html);

    var select = modal.self.find("select#members");
    for(var id in allMembers) {
        var option;
        option  = '<option value="' + allMembers[id].id + '-' + 
                allMembers[id].user.id + '-' + 
                allMembers[id].user.firstName + ' ' + allMembers[id].user.lastName + '">';
        option += allMembers[id].user.lastName + " " + allMembers[id].user.firstName;
        option += '</option>';
        select.append(option);
    }

    var addManagersForm = modal.self.find("form");
    addManagersForm.submit(function(event) {
        event.preventDefault();
        addManagers(addManagersForm, group);
    });
}

function fillModalRemoveUsers(modal, group) {
    modal.clear();
    
    var loadImage = new LoadImage(modal.self.find(".modal-body"), "64px");
    callPerun("groupsManager", "getGroupRichMembers", {group: group.id}, function(members) {
        if (!members) {
            (flowMessager.newMessage("Members", "can't be loaded.", "danger")).draw();
            return;
        }
        loadImage.hide();
        
        if (members.length === 0) {
            (new Message("", "No users found", "info", modal.self.find(".modal-body"))).draw();
            return;
        }
        
        var html;
        html  = '          <form role="form">';
        html += '            <div class="form-group">';
        html += '              <label for="members">Select users</label>';
        html += '              <select id="members" multiple class="form-control">';
        html += '              </select>';
        html += '            </div>';  
        html += '            <button type="submit" class="btn btn-danger">Remove Members</button>';
        html += '          </form>';
        modal.addBody(html);
        for(var id in members) {
            var option;
            option  = '<option value="' + members[id].id + '-' + 
                    members[id].user.id + '-' + 
                    members[id].user.firstName + ' ' + members[id].user.lastName + '">';
            option += members[id].user.lastName + " " + members[id].user.firstName;
            option += '</option>';
            modal.self.find("select#members").append(option);
        }
        
        var removeMembersForm = modal.self.find("form");
        removeMembersForm.submit(function(event) {
            event.preventDefault();
            removeMembers(removeMembersForm, group);
        });
    });
}

function fillModalRemoveManagers(modal, group) {
    modal.clear();
    
    var loadImage = new LoadImage(modal.self.find(".modal-body"), "64px");
    callPerun("groupsManager", "getAdmins", {group: group.id}, function(managers) {
        if (!managers) {
            (flowMessager.newMessage("Members", "can't be loaded.", "danger")).draw();
            return;
        }
        loadImage.hide();
        if (managers.length === 0) {
            (new Message("", "No users found", "info", modal.self.find(".modal-body"))).draw();
            return;
        }
        
        var html;
        html  = '          <form role="form">';
        html += '            <div class="form-group">';
        html += '              <label for="members">Select users</label>';
        html += '              <select id="members" multiple class="form-control">';
        html += '              </select>';
        html += '            </div>'; 
        html += '            <button type="submit" class="btn btn-danger">Remove Managers</button>';
        html += '          </form>';
        modal.addBody(html);
        for(var id in managers) {
            var option;
            option  = '<option value="' + managers[id].id + '-' + 
                    managers[id].id + '-' + 
                    managers[id].firstName + ' ' + managers[id].lastName + '">';
            option += managers[id].lastName + " " + managers[id].firstName;
            option += '</option>';
            modal.self.find("select#members").append(option);
        }
        
        var removeManagersForm = modal.self.find("form");
        removeManagersForm.submit(function(event) {
            event.preventDefault();
            removeManagers(removeManagersForm, group);
        });
    });
}

function fillModalDeleteGroup(modal, group) {
    modal.clear();
    
    var html;
    html  = "<p>";
    html += "Do you really want to delete whole group?";
    html += "</p>";
    html += '<div class="btn-toolbar">';
    html += '  <div class="btn-group pull-right">';
    html += '    <button id="deleteGroup" class="btn btn-danger">Delete Group</button>';
    html += '  </div>';
    html += '  <div class="btn-group pull-right">';
    html += '    <button class="btn btn-default" data-dismiss="modal">Close</button>';
    html += '  </div>';
    html += '</div>';
    modal.addBody(html);
    
    modal.self.find("button#deleteGroup").click(function() {
        deleteGroup(group);
    });
}