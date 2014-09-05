/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function entryPoint(user) {
    loadAlternativePasswords(user);
}

$(document).ready(function() {

    $("#createAlternativePassword").submit(function(event) {
        event.preventDefault();
        
        var loadImage = new LoadImage($('#user-preferredLanguage'), "20px");
        
        callPerunPost("usersManager", "createAlternativePassword", {user: user.id, description: "test", loginNamespace: "einfra", password: "12345"}, function() {
            
            
            
            loadImage.hide();
            (new Message("Preffered language", "was saved successfully", "success")).draw();
        });
        
    });

});


function loadAlternativePasswords(user) {
    if (!user) {
        (new Message("Alternative Passwords", "can't be loaded because user isn't loaded.", "danger")).draw();
        return;
    }
    var loadImage = new LoadImage($('#alternative-password-table'), "64px");
    
    callPerun("attributesManager", "getAttributes", {user: user.id}, function(userAttributes) {
        if (!userAttributes) {
            (new Message("User attributes", "can't be loaded.", "danger")).draw();
            return;
        }
        if (!userAttributes.alternativePasswords) {
            userAttributes.alternativePasswords = [];
        }
        fillAlternativePasswords(userAttributes.alternativePasswords);
        loadImage.hide();
        //(new Message("User data", "was loaded successfully.", "success")).draw();
    });
}

function fillAlternativePasswords(alternativePasswords) {
    if (!alternativePasswords) {
        (new Message("Alternative Passwords", "can't be fill.", "danger")).draw();
        return;
    }
    
    var alternativePasswordsTable = new PerunTable();
    alternativePasswordsTable.addColumn("", "#", "number");
    alternativePasswordsTable.addColumn("value", "Description");
    alternativePasswordsTable.addColumn("delete", "", "button");
    alternativePasswordsTable.setValues(alternativePasswords);
    var tableHtml = alternativePasswordsTable.draw();
    $("#alternativePasswordTable").html(tableHtml);
    
}