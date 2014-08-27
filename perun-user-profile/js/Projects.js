/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var vos = [];

function loadVOs() {
    callPerun("usersManager", "getVosWhereUserIsMember", {user: user.id})(function(vosResult) {
        if (vos === null) {
            return null;
        }
        vos = vosResult;
        fillVOs(vos);
    });
}

function fillVOs(vos) {
    var projectTable = new PerunTable();
    projectTable.addColumn("id", "ID");
    projectTable.addColumn("name", "Project");
    projectTable.setValues(vos);
    var tableHtml = projectTable.draw();
    $("#projects-table").html(tableHtml);
}