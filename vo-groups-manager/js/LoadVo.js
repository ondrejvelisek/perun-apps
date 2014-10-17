/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function entryPoint(user) {
    
}

$(document).ready(function() {
    innerTabs = new Tabs($("#innerTabs"));
    loadVo();
});

var vo;
function loadVo() {
    callPerun("vosManager", "getVoByShortName", {shortName: voConfiguration.SHORT_NAME }, function(voResult) {
        if (!voResult) {
            (flowMessager.newMessage("VO","can't be loaded.","danger")).draw();
            return;
        }
        vo = voResult;
        showVo();
    });
}

//require loaded global vo variable
function showVo() {
    if (!vo) {
        (flowMessager.newMessage("Can not show VO", "because vo has not loaded" , "error")).draw();
        return;
    }
    if (!innerTabs.containsTab("vo")) {
        addVoTab(vo);
        $("#groupsManagerLink").click(function() { 
            showVo();
        });
    }
    innerTabs.show("vo");
    
    fillVoInfo(vo);
    loadGroups(vo);
    loadAllMembers(vo);
}
    
function addVoTab(vo) {
    var voTab = new Tab(vo.shortName, "vo");
    innerTabs.addTab(voTab);
    
    var content;
    content  = '<div class="page-header"><h2>' + vo.name + '</h2></div>';
    content += '<div class="btn-toolbar">';
    content += '  <div class="btn-group">';
    content += '    <button class="btn btn-success" data-toggle="modal" data-target="#createGroupInVo">Create Group</button>';
    content += '  </div>';
    content += '  <div class="btn-group">';
    content += '    <button class="btn btn-success" data-toggle="modal" data-target="#inviteUser" disabled>Invite User</button>';
    content += '  </div>';
    content += '</div>';
    content += '<div id="groupsTable"></div>';
    voTab.addContent(content);
    
    var createGroupModal = new Modal("Create group in " + vo.shortName, "createGroupInVo", voTab.place);
    createGroupModal.init();
    fillModalCreateGroup(createGroupModal, vo);
}

function createGroupInVo(form, vo) {
    var name = form.find("#name");
    var description = form.find("#description");
    var newGroup = {name: name.val(), description: description.val()};
    callPerunPost("groupsManager", "createGroup", {vo: vo.id, group: newGroup}, function(createdGroup) {
        innerTabs.place.find("#vo .modal").modal('hide');
        (flowMessager.newMessage(createdGroup.name, "group was created succesfuly", "success")).draw();
        loadGroups(vo);
        showGroup(createdGroup);
    });
}

function fillVoInfo(vo) {
    if (!vo) {
        (flowMessager.newMessage("Vo","can't be fill.","danger")).draw();
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
        callBackLoadAllMembersList();
    });
}

var callMeList = [];
function callMeAfterLoadAllMembers(method, args) {
    var methodWithArgs = {method: method, args: args};
    callMeList.push(methodWithArgs);
}
function callBackLoadAllMembersList() {
    for (var i in callMeList) {
        if (callMeList[i].args > 5) {
            debug("fatal error: cant call back method with more than 5 attrs");
        }
        callMeList[i].method(callMeList[i].args[0], 
            callMeList[i].args[1], 
            callMeList[i].args[2], 
            callMeList[i].args[3], 
            callMeList[i].args[4]);
    }
}