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
        drawMessage(new Message("Identities","can't be loaded because user isn't loaded","error"));
        return;
    }
    
    callPerun("usersManager", "getUserExtSources", {user: user.id}, function(extSources) {
        if (!extSources) {
            drawMessage(new Message("Identities","can't be loaded","error"));
            return;
        }
        fillExtSources(extSources);
        //drawMessage(new Message("Identities","was loaded successfully.","success"));
    });
}

function fillExtSources(extSources) {
    if (!extSources) {
        drawMessage(new Message("Identities","can't be fill","error"));
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
        drawMessage(new Message("Federations","can't be fill","error"));
        return;
    }
    
    var federationsTable = new PerunTable();
    federationsTable.addColumn("name", "Federated identities");
    federationsTable.setValues(federations);
    $("#federations-table").html(federationsTable.draw());
}

function fillCertificates(certificates) {
    if (!certificates) {
        drawMessage(new Message("Certificates","can't be fill","error"));
        return;
    }
    
    var certificatesTable = new PerunTable();
    certificatesTable.addColumn("name", "Digital certificates");
    certificatesTable.setValues(certificates);
    $("#certificates-table").html(certificatesTable.draw());
}