/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {
    $("#projectsLink").click(function() { 
       loadProjects(user);
    });
});
    
function loadProjects(user) {
    if (!user) {
        drawMessage(new Message("Projects","can't be loaded because user isn't loaded.","error"));
        return;
    }
    callPerun("usersManager", "getVosWhereUserIsMember", {user: user.id}, function(projects) {
        if (!projects) {
            drawMessage(new Message("Projects","can't be loaded.","error"));
            return;
        }
        fillProjects(projects);
        //drawMessage(new Message("Projects","was loaded successfully.","success"));
    });
}

function fillProjects(projects) {
    if (!projects) {
        drawMessage(new Message("Projects","can't be fill.","error"));
        return;
    }
    var projectTable = new PerunTable();
    projectTable.addColumn("name", "Projects");
    projectTable.setValues(projects);
    var tableHtml = projectTable.draw();
    $("#projects-table").html(tableHtml);
}