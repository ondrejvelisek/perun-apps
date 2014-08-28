/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var extSources = [];

function loadIdentities() {
    callPerun("usersManager", "getUserExtSources", {user: user.id})(function(externalSources) {
        if (externalSources === null) {
            return null;
        }
        extSources = externalSources;
        fillExtSources(extSources);
        drawMessage(new Message("Identities","was loaded successfully.","success"));
    });
}

function fillExtSources(extSources) {
    var federated = [];
    var certificates = [];
    for(var extSourcesId in extSources) {
        switch (extSources[extSourcesId].extSource.type) {
            case "cz.metacentrum.perun.core.impl.ExtSourceIdp":
                federated.push(extSources[extSourcesId].extSource);
                break;
            case "cz.metacentrum.perun.core.impl.ExtSourceX509":
                certificates.push(extSources[extSourcesId].extSource);
                break;
        }
    }
    fillFederations(federated);
    fillCertificates(certificates);
}

function fillFederations(extSources) {
    var federationsTable = new PerunTable();
    federationsTable.addColumn("id", "ID");
    federationsTable.addColumn("name", "Federation");
    federationsTable.setValues(extSources);
    $("#federations-table").html(federationsTable.draw());
}
function fillCertificates(extSources) {
    var certificatesTable = new PerunTable();
    certificatesTable.addColumn("id", "ID");
    certificatesTable.addColumn("name", "certificate");
    certificatesTable.setValues(extSources);
    $("#certificates-table").html(certificatesTable.draw());
}