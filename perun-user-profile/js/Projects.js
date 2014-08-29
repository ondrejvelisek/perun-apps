/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {
    $("#projectsLink").click(function() { 
       loadProjects();
    });
});
    

function loadProjects() {
    callPerun("usersManager", "getVosWhereUserIsMember", {user: user.id})(function(projects) {
        if (projects === null) {
            return null;
        }
        fillProjects(projects);
        drawMessage(new Message("Projects","was loaded successfully.","success"));
    });
}

function fillProjects(vos) {
    var projectTable = new PerunTable();
    projectTable.addColumn("name", "Project");
    projectTable.setValues(vos);
    var tableHtml = projectTable.draw();
    $("#projects-table").html(tableHtml);
}