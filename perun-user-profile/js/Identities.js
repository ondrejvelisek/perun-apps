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
        (new Message("Identities","can't be loaded because user isn't loaded","danger")).draw();
        return;
    }
    var loadImage = new LoadImage($("#federations-table, #certificates-table"), "auto");
    
    callPerun("usersManager", "getUserExtSources", {user: user.id}, function(extSources) {
        if (!extSources) {
            (new Message("Identities","can't be loaded","danger")).draw();
            return;
        }
        fillExtSources(extSources);
        loadImage.hide();
        //(new Message("Identities","was loaded successfully.","success")).draw();
    });
}

function fillExtSources(extSources) {
    if (!extSources) {
        (new Message("Identities","can't be fill","danger")).draw();
        return;
    }
    
    var federations = [];
    var certificates = [];
    for(var extSourcesId in extSources) {
        switch (extSources[extSourcesId].extSource.type) {
            case "cz.metacentrum.perun.core.impl.ExtSourceIdp":
                federations.push(extSources[extSourcesId]);
                break;
            case "cz.metacentrum.perun.core.impl.ExtSourceX509":
                certificates.push(extSources[extSourcesId]);
                break;
        }
    }
    fillFederations(federations);
    fillCertificates(certificates);
}

function fillFederations(federations) {
    if (!federations) {
        (new Message("Federations","can't be fill","danger")).draw();
        return;
    }
    
    var federationsFriendly = [];
    for (var id in federations) {
        federationsFriendly[id] = {};
        federationsFriendly[id]["name"] = federations[id].extSource.name;
        federationsFriendly[id]["login"] = federations[id].login;
    }
    
    var federationsTable = new PerunTable();
    federationsTable.addColumn({type:"number", title:"#"});
    federationsTable.addColumn({type:"text", title:"Federated identities", name:"name"});
    federationsTable.addColumn({type:"text", title:"Login", name:"login"});
    federationsTable.setValues(federationsFriendly);
    $("#federations-table").html(federationsTable.draw());
}

function fillCertificates(certificates) {
    if (!certificates) {
        (new Message("Certificates","can't be fill","danger")).draw();
        return;
    }
    
    var certificatesFriendly = [];
    for (var id in certificates) {
        certificatesFriendly[id] = {};
        certificatesFriendly[id]["name"] = certificates[id].extSource.name;
        certificatesFriendly[id]["login"] = certificates[id].login;
    }
    
    var certificatesTable = new PerunTable();
    certificatesTable.addColumn({type:"number", title:"#"});
    certificatesTable.addColumn({type:"text", title:"Digital certificates", name:"name"});
    certificatesTable.addColumn({type:"text", title:"Login", name:"login"});
    certificatesTable.setValues(certificatesFriendly);
    $("#certificates-table").html(certificatesTable.draw());
}