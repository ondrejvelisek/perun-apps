/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {

    $("#sshkeysLink").click(function() {
        loadSSHKeys(user);
    });
    

    $("#addNewSSHKey").click(function() {
        if (!$("#newSSHKey").val().trim()) {
            (new Message("SSH key", "field can't be empty", "warning")).draw();
            return;
        }
        var newSSHKey = $("#newSSHKey").val().trim();
        $("#newSSHKey").val("");
        var loadImage = new LoadImage($("#sshkeys-table"), "auto");
        
        callPerun("attributesManager", "getAttribute", {user: user.id, attributeName: "urn:perun:user:attribute-def:def:sshPublicKey"}, function(sshPublicKey) {
            if (!sshPublicKey) {
                (new Message("SSH keys", "can't be loaded", "error")).draw();
                return;
            }
            // if it's first SSH key.
            if (!sshPublicKey.value) {
                sshPublicKey.value = [];
            }
            sshPublicKey.value.push(newSSHKey);
            callPerunPost("attributesManager", "setAttribute", {user: user.id, attribute: sshPublicKey}, function() {
                fillSSHKeys(sshPublicKey);
                loadImage.hide();
                (new Message("SSH key", "was added successfully", "success")).draw();
            });
        });
    });

});

function loadSSHKeys(user) {
    if (!user) {
        (new Message("SSH keys", "can't be loaded becouse user isn't loaded.", "error")).draw();
        return;
    }
    var loadImage = new LoadImage($("#sshkeys-table"), "auto");
    
    callPerun("attributesManager", "getAttribute", {user: user.id, attributeName: "urn:perun:user:attribute-def:def:sshPublicKey"}, function(sshPublicKey) {
        if (!sshPublicKey) {
            (new Message("SSH keys", "can't be loaded", "error")).draw();
            return;
        }
        fillSSHKeys(sshPublicKey);
        loadImage.hide();
        //(new Message("SSH keys", "was loaded successfully.", "success")).draw();
    });
}

function fillSSHKeys(sshPublicKey) {
    if (!sshPublicKey) {
        (new Message("SSH keys", "can't be fill", "error")).draw();
        return;
    }
    var sshKeysTable = new PerunTable();
    sshKeysTable.addColumn("", "#", "number");
    sshKeysTable.addColumn("value", "SSH keys");
    sshKeysTable.addColumn("remove", "", "button");
    sshKeysTable.setList(sshPublicKey.value);
    var tableHtml = sshKeysTable.draw();
    $("#sshkeys-table").html(tableHtml);
    
    $('#sshkeys-table button[id^="tableBtn-"]').click(function() {
        var sshId = parseInt(this.id.split('-')[1]);
        var loadImage = new LoadImage($("#sshkeys-table"), "auto");
        
        callPerun("attributesManager", "getAttribute", {user: user.id, attributeName: "urn:perun:user:attribute-def:def:sshPublicKey"}, function(sshPublicKey) {
            if (!sshPublicKey) {
                (new Message("SSH keys", "can't be loaded", "error")).draw();
                return;
            }
            if (!sshPublicKey.value) {
                (new Message("SSH keys", "is empty", "warning")).draw();
                return;
            }
            sshPublicKey.value.splice(sshId);
            callPerunPost("attributesManager", "setAttribute", {user: user.id, attribute: sshPublicKey}, function() {
                fillSSHKeys(sshPublicKey);
                loadImage.hide();
                (new Message("SSH key", "was added successfully", "success")).draw();
            });
        });
    });
}