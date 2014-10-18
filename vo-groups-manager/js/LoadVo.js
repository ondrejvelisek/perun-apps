/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function entryPoint(user) {
    innerTabs = new Tabs($("#innerTabs"));
    loadVo();
}

$(document).ready(function() {

});

var vo;
function loadVo() {
    callPerun("vosManager", "getVoByShortName", {shortName: voConfiguration.SHORT_NAME}, function(voResult) {
        if (!voResult) {
            (flowMessager.newMessage("VO", "can't be loaded.", "danger")).draw();
            return;
        }
        vo = voResult;
        showVo();
    });
}

//require loaded global vo variable
function showVo() {
    if (!vo) {
        (flowMessager.newMessage("Can not show VO", "because vo has not loaded", "error")).draw();
        return;
    }
    if (!innerTabs.containsTab("vo")) {
        addVoTab(vo);
        $("#groupsManagerLink").click(function() {
            showVo();
        });
    }
    var hash = document.location.hash.substring(1).split("#")[1];
    if (hash != undefined && hash != "vo") {
        showGroup(hash);
    } else {
        innerTabs.show("vo");
    }
    

    fillVoInfo(vo);
    loadGroups(vo);
    loadAllMembers(vo);
}

function addVoTab(vo) {
    var voTab = new Tab(vo.shortName, "vo");
    innerTabs.addTab(voTab);

    var content;
    content = '<div class="page-header"><h2>' + vo.name + '</h2></div>';
    content += '<div class="btn-toolbar">';
    content += '  <div class="btn-group">';
    content += '    <button class="btn btn-primary" data-toggle="modal" data-target="#createGroupInVo">Create Group</button>';
    content += '  </div>';
    content += '  <div class="btn-group">';
    content += '    <button class="btn btn-primary" data-toggle="modal" data-target="#inviteUser">Invite User</button>';
    content += '  </div>';
    content += '</div>';
    content += '<div id="groupsTable"></div>';
    voTab.addContent(content);

    var voAuthz = new Authorization(roles, vo, null);
    var buttons = voTab.place.find('.btn-toolbar');
    voAuthz.addObject(buttons.find('button[data-target^=#createGroupInVo]'), ["PERUNADMIN", "VOADMIN", "TOPGROUPCREATOR"]);
    voAuthz.addObject(buttons.find('button[data-target^=#inviteUser]'), ["PERUNADMIN", "VOADMIN"]);
    voAuthz.addObject(voTab.place.find('.groupsTable'), ["PERUNADMIN", "VOOBSERVER", "VOADMIN", "GROUPADMIN", "TOPGROUPCREATOR"]);
    voAuthz.check();

    var createGroupModal = new Modal("Create group in VO " + vo.name, "createGroupInVo", voTab.place);
    createGroupModal.init();
    fillModalCreateGroup(createGroupModal, vo);

    var inviteUserModal = new Modal("Invite user to VO " + vo.name, "inviteUser", voTab.place);
    inviteUserModal.init();
    fillModalInviteUser(inviteUserModal, vo);
}

function createGroupInVo(form, vo) {
    var name = form.find("#name");
    var description = form.find("#description");
    var newGroup = {name: name.val(), description: description.val()};
    callPerunPost("groupsManager", "createGroup", {vo: vo.id, group: newGroup}, function(createdGroup) {
        innerTabs.place.find("#vo .modal").modal('hide');
        (flowMessager.newMessage(createdGroup.name, "group was created succesfuly", "success")).draw();
        loadGroups(vo);
        showGroup(createdGroup.id);
    });
}

function fillVoInfo(vo) {
    if (!vo) {
        (flowMessager.newMessage("Vo", "can't be fill.", "danger")).draw();
        return;
    }
    $("#vo-name").text(vo.name);
    //$('#groupsManagerLink > span').text(vo.shortName);
}

var allMembers;
function loadAllMembers(vo) {
    callPerun("membersManager", "getCompleteRichMembers", {vo: vo.id, attrsNames: ["urn:perun:member:attribute-def:def:mail"]}, function(members) {
        if (!members) {
            return;
        }
        allMembers = members;
        callBackAfter(loadAllMembers);
    });
}

var callMeAfterList = [];
function callMeAfter(method, args, after) {
    callMeAfterList.push({method: method, args: args, after: after});
}
function callBackAfter(after) {
    for (var i = callMeAfterList.length -1; i >= 0 ; i--) {
        var callMeAfter = callMeAfterList[i];
        if (callMeAfter.after == after) {
            if (callMeAfter.args.length > 5) {
                debug("fatal error: cant call back method with more than 5 attrs");
            }
            callMeAfter.method(callMeAfter.args[0],
                    callMeAfter.args[1],
                    callMeAfter.args[2],
                    callMeAfter.args[3],
                    callMeAfter.args[4]);
            callMeAfterList.splice(callMeAfterList.indexOf(callMeAfter), 1);
            //debug(callMeAfterList.length);
        }
    }
}

function fillModalInviteUser(modal, vo) {
    modal.clear();

    var html;
    html = '          <form role="form">';
    html += '            <div class="form-group">';
    html += '              <label for="name">Users e-Mail</label>';
    html += '              <input type="email" class="form-control" id="name" placeholder="Users e-Mail" autofocus>';
    html += '            </div>';
    html += '            <button type="submit" class="btn btn-primary">Invite User</button>';
    html += '          </form>';
    modal.addBody(html);

    var inviteUserForm = modal.self.find("form");
    inviteUserForm.submit(function(event) {
        event.preventDefault();
        debug("Not support yet.");
    });
}