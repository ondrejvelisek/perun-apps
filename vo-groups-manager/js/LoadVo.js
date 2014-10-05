/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function entryPoint(user) {
    
}

$(document).ready(function() {
    loadVo();
    
    $("#voLink").click(function() { 
       loadVo();
    });
});
    
function loadVo() {
    callPerun("vosManager", "getVoByShortName", {shortName: voConfiguration.SHORT_NAME }, function(vo) {
        if (!vo) {
            (flowMessager.newMessage("VO","can't be loaded.","danger")).draw();
            return;
        }
        fillVoInfo(vo);
        loadGroups(vo);
    });
}

function fillVoInfo(vo) {
    if (!vo) {
        (flowMessager.newMessage("Vo","can't be fill.","danger")).draw();
        return;
    }
    $("#vo-name").text(vo.name);
}