/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() {
    $("#identitiesLink").click(function() { 
        loadIdentities(user);
    });
});

function loadIdentities(user) {
    if (!user) {
        (new Message("Identities","can't be loaded because user isn't loaded","error")).draw();
        return;
    }
    var loadImage = new LoadImage($("#federations-table, #certificates-table"), "auto");
    
    callPerun("usersManager", "getUserExtSources", {user: user.id}, function(extSources) {
        if (!extSources) {
            (new Message("Identities","can't be loaded","error")).draw();
            return;
        }
        fillExtSources(extSources);
        loadImage.hide();
        //(new Message("Identities","was loaded successfully.","success")).draw();
    });
}

function fillExtSources(extSources) {
    if (!extSources) {
        (new Message("Identities","can't be fill","error")).draw();
        return;
    }
    
    var federations = [];
    var certificates = [];
    for(var extSourcesId in extSources) {
        switch (extSources[extSourcesId].extSource.type) {
            case "cz.metacentrum.perun.core.impl.ExtSourceIdp":
                federations.push(extSources[extSourcesId].extSource);
                break;
            case "cz.metacentrum.perun.core.impl.ExtSourceX509":
                certificates.push(extSources[extSourcesId].extSource);
                break;
        }
    }
    fillFederations(federations);
    fillCertificates(certificates);
}

function fillFederations(federations) {
    if (!federations) {
        (new Message("Federations","can't be fill","error")).draw();
        return;
    }
    
    var federationsTable = new PerunTable();
    federationsTable.addColumn("", "#", "number");
    federationsTable.addColumn("name", "Federated identities");
    federationsTable.setValues(federations);
    $("#federations-table").html(federationsTable.draw());
}

function fillCertificates(certificates) {
    if (!certificates) {
        (new Message("Certificates","can't be fill","error")).draw();
        return;
    }
    
    var certificatesTable = new PerunTable();
    certificatesTable.addColumn("", "#", "number");
    certificatesTable.addColumn("name", "Digital certificates");
    certificatesTable.setValues(certificates);
    $("#certificates-table").html(certificatesTable.draw());
}