/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function entryPoint(user) {
    loadAlternativePasswords(user);
}

$(document).ready(function() {

    $("#createAltPassword").submit(function(event) {
        event.preventDefault();

        var password = randomPassword(8);
        var description = $("#altPasswordDescription").val();
        showPassword(description, password);
        $("#altPasswordDescription").val("");
        callPerunPost("usersManager", "createAlternativePassword", {user: user.id, description: description, loginNamespace: "einfra", password: password}, function() {

            loadAlternativePasswords(user);
            showPassword(description, password);
            (new Message("Alternative password", "was created successfully", "success")).draw();
        });

    });

});


function loadAlternativePasswords(user) {
    if (!user) {
        (new Message("Alternative Passwords", "can't be loaded because user isn't loaded.", "danger")).draw();
        return;
    }
    var loadImage = new LoadImage($('#altPasswordsTable'), "64px");

    callPerun("attributesManager", "getAttribute", {user: user.id, attributeName: "urn:perun:user:attribute-def:def:altPasswords:einfra"}, function(altPasswords) {
        if (!altPasswords) {
            (new Message("Alternative passwords", "can't be loaded.", "danger")).draw();
            return;
        }
        fillAlternativePasswords(altPasswords);
        loadImage.hide();
        //(new Message("User data", "was loaded successfully.", "success")).draw();
    });
}

function fillAlternativePasswords(altPasswords) {
    if (!altPasswords) {
        (new Message("Alternative Passwords", "can't be fill.", "danger")).draw();
        return;
    }

    var altPasswordsTable = new PerunTable();
    altPasswordsTable.addColumn({type: "number", title: "#"});
    altPasswordsTable.addColumn({type: "text", title: "Description", name: "key"});
    altPasswordsTable.addColumn({type: "button", title: "", btnText: "delete", btnType: "danger", btnId: "value"});
    altPasswordsTable.setList(altPasswords.value);
    var tableHtml = altPasswordsTable.draw();
    $("#altPasswordsTable").html(tableHtml);

    $("#altPasswordsTable button[id^='tableBtn-']").click(function() {
        var loadImage = new LoadImage($('#altPasswordsTable'), "40px");
        var passwordId = $(this).attr("id").split('-')[1];
        callPerunPost("usersManager", "deleteAlternativePassword", {user: user.id, loginNamespace: "einfra", passwordId: passwordId}, function() {
            loadAlternativePasswords(user);
            loadImage.hide();
            (new Message("Alternative password", "was deleted successfully:", "success")).draw();
        });
    });

}

function randomPassword(length) {
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    pass = "";
    for (x = 0; x < length; x++)
    {
        i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}

function showPassword(description, password) {
    $("#showPassword .description").text(description);
    $("#showPassword .password").text(password);
    
    $("#showPassword").modal();
}
$('#showPassword').on('hidden.bs.modal', function (e) {
    $("#showPassword .password").text("...");
});