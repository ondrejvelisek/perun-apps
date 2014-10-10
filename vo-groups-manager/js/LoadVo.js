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

function loadVo() { //called only once
    callPerun("vosManager", "getVoByShortName", {shortName: voConfiguration.SHORT_NAME }, function(vo) {
        if (!vo) {
            (flowMessager.newMessage("VO","can't be loaded.","danger")).draw();
            return;
        }
        showVo(vo);
    });
}

function showVo(vo) {
    if (!vo) {
        return;
    }
    if (!innerTabs.containsTab("vo")) {
        addVoTab(vo);
    }
    innerTabs.show("vo");
    
    $("#groupsManagerLink").click(function() { 
        showVo(vo);
    });
    fillVoInfo(vo);
    loadGroups(vo);
}
    
function addVoTab(vo) {
    var content;
    content  = '<div class="page-header"><h2>' + vo.name + '</h2></div>';
    content += '<div class="btn-toolbar">';
        content += '<div class="btn-group">';
            content += '<button class="btn btn-success" data-toggle="modal" data-target="#createGroup">Create Group</button>';
        content += '</div>';
    content += '</div>';
    content += '<div id="groupsTable"></div>';
    content += getCreateGroupModalHtml("Group");
    innerTabs.addTab(new Tab(vo.shortName, "vo", content));
    var form = innerTabs.place.find("#vo form");
    form.submit(function() {
        var name = form.find("#name");
        var shortName = form.find("#shortName");
        var description = form.find("#description");
        var group = {name:name,shortName:shortName,description:description};
        callPerunPost("groupsManager", "createGroup", {vo: vo.id, group: group}, function() {
            debug("succesfully created");
        });
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