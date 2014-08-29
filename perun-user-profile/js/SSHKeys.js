/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {
    $("#sshkeysLink").click(function() { 
        loadSSHKeys();
    });
});

sshPublicKey = {};

$(document).ready(function() {
    
    $("#addNewSSHKey").click(function() {
        if (!$("#newSSHKey").val().trim()) {
            drawMessage(new Message("SSH key","field can't be empty","warning"));
            return null;
        }
        if (sshPublicKey.value === null) {
            sshPublicKey.value = [];
        }
        sshPublicKey.value.push($("#newSSHKey").val().trim());
        callPerunPost("attributesManager", "setAttribute", {user: user.id, attribute: sshPublicKey})(function() {
            fillSSHKeys(sshPublicKey);
            $("#newSSHKey").val("");
            drawMessage(new Message("SSH key","was added successfully","success"));
        });
    });

});

function loadSSHKeys() {
    callPerun("attributesManager", "getAttribute", {user: user.id, attributeName: "urn:perun:user:attribute-def:def:sshPublicKey"})(function(sshKey) {
        if (sshKey === null) {
            return null;
        }
        sshPublicKey = sshKey;
        fillSSHKeys(sshKey);
        drawMessage(new Message("SSH keys","was loaded successfully.","success"));
    });
}

function fillSSHKeys(sshKey) {
    var sshKeysTable = new PerunTable();
    sshKeysTable.addColumn("value", "SSH key");
    sshKeysTable.setList(sshKey);
    var tableHtml = sshKeysTable.draw();
    $("#sshkeys-table").html(tableHtml);
}