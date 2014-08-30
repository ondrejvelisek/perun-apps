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
            drawMessage(new Message("SSH key", "field can't be empty", "warning"));
            return;
        }
        var newSSHKey = $("#newSSHKey").val().trim();
        $("#newSSHKey").val("");
        callPerun("attributesManager", "getAttribute", {user: user.id, attributeName: "urn:perun:user:attribute-def:def:sshPublicKey"}, function(sshPublicKey) {
            if (!sshPublicKey) {
                drawMessage(new Message("SSH keys", "can't be loaded", "error"));
                return;
            }
            // if it's first SSH key.
            if (!sshPublicKey.value) {
                sshPublicKey.value = [];
            }
            sshPublicKey.value.push(newSSHKey);
            callPerunPost("attributesManager", "setAttribute", {user: user.id, attribute: sshPublicKey}, function() {
                fillSSHKeys(sshPublicKey);
                drawMessage(new Message("SSH key", "was added successfully", "success"));
            });
        });
    });

});

function loadSSHKeys(user) {
    if (!user) {
        drawMessage(new Message("SSH keys", "can't be loaded becouse user isn't loaded.", "error"));
        return;
    }
    callPerun("attributesManager", "getAttribute", {user: user.id, attributeName: "urn:perun:user:attribute-def:def:sshPublicKey"}, function(sshPublicKey) {
        if (!sshPublicKey) {
            drawMessage(new Message("SSH keys", "can't be loaded", "error"));
            return;
        }
        fillSSHKeys(sshPublicKey);
        //drawMessage(new Message("SSH keys", "was loaded successfully.", "success"));
    });
}

function fillSSHKeys(sshPublicKey) {
    if (!sshPublicKey) {
        drawMessage(new Message("SSH keys", "can't be fill", "error"));
        return;
    }
    var sshKeysTable = new PerunTable();
    sshKeysTable.addColumn("value", "SSH key");
    sshKeysTable.setList(sshPublicKey);
    var tableHtml = sshKeysTable.draw();
    $("#sshkeys-table").html(tableHtml);
}