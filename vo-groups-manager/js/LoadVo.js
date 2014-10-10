/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function entryPoint(user) {
    
}

$(document).ready(function() {
    breadcrumbs = new Breadcrumbs($("#breadcrumbs"));
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
        var content = '<div class="page-header"><h2>' + vo.name + '</h2></div>';
        content += '<div id="groupsTable"></div>';
        innerTabs.addTab(new Tab(vo.shortName, "vo", content));
    }
    innerTabs.show("vo");
    
    $("#groupsManagerLink").click(function() { 
        showVo(vo);
    });
    breadcrumbs.pushItem(vo);
    fillVoInfo(vo);
    loadGroups(vo);
}
    


function fillVoInfo(vo) {
    if (!vo) {
        (flowMessager.newMessage("Vo","can't be fill.","danger")).draw();
        return;
    }
    $("#vo-name").text(vo.name);
    //$('#groupsManagerLink > span').text(vo.shortName);
}