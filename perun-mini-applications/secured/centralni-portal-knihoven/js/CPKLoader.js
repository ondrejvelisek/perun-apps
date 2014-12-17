$(document).ready(function(){

        $("#identities-table-fed").html(Configuration.LOADER_IMAGE);
    
        var data = {};
        callPerunSync("usersManager", "getUserExtSources", data, { user : user.id });

        var orgs = [];
        orgs["https://idp.upce.cz/idp/shibboleth"] = "University in Pardubice";
        orgs["https://idp.slu.cz/idp/shibboleth"] = "University in Opava";
        orgs["https://login.feld.cvut.cz/idp/shibboleth"] = "Faculty of Electrical Engineering, Czech Technical University In Prague";            
        orgs["https://www.vutbr.cz/SSO/saml2/idp"] = "Brno University of Technology";
        orgs["https://shibboleth.nkp.cz/idp/shibboleth"] = "The National Library of the Czech Republic";
        orgs["https://idp2.civ.cvut.cz/idp/shibboleth"] = "Czech Technical University In Prague";
        orgs["https://shibbo.tul.cz/idp/shibboleth"] = "Technical University of Liberec";
        orgs["https://idp.mendelu.cz/idp/shibboleth"] = "Mendel University in Brno";
        orgs["https://cas.cuni.cz/idp/shibboleth"] = "Charles University in Prague";
        orgs["https://wsso.vscht.cz/idp/shibboleth"] = "Institute of Chemical Technology Prague";
        orgs["https://idp.vsb.cz/idp/shibboleth"] = "VSB – Technical University of Ostrava";
        orgs["https://whoami.cesnet.cz/idp/shibboleth"] = "CESNET";
        orgs["https://helium.jcu.cz/idp/shibboleth"] = "University of South Bohemia";
        orgs["https://idp.ujep.cz/idp/shibboleth"] = "Jan Evangelista Purkyne University in Usti nad Labem";
        orgs["https://idp.amu.cz/idp/shibboleth"] = "Academy of Performing Arts in Prague";
        orgs["https://idp.lib.cas.cz/idp/shibboleth"] = "Academy of Sciences Library";
        orgs["https://shibboleth.mzk.cz/simplesaml/metadata.xml"] = "Moravian  Library";
        orgs["https://idp2.ics.muni.cz/idp/shibboleth"] = "Masaryk University";
        orgs["https://idp.upol.cz/idp/shibboleth"] = "Palacky University, Olomouc";
        orgs["https://idp.fnplzen.cz/idp/shibboleth"] = "FN Plzen";
        orgs["https://id.vse.cz/idp/shibboleth"] = "University of Economics, Prague";
        orgs["https://shib.zcu.cz/idp/shibboleth"] = "University of West Bohemia";
        orgs["https://idptoo.osu.cz/simplesaml/saml2/idp/metadata.php"] = "University of Ostrava";
        orgs["https://login.ics.muni.cz/idp/shibboleth"] = "MetaCentrum";
        orgs["https://idp.hostel.eduid.cz/idp/shibboleth"] = "eduID.cz Hostel";
        orgs["https://shibboleth.techlib.cz/idp/shibboleth"] = "National Library of Technology";

        var social = [];
        social["@google.extidp.cesnet.cz"] = "Google";
        social["@facebook.extidp.cesnet.cz"] = "Facebook";
        social["@mojeid.extidp.cesnet.cz"] = "mojeID";
        social["@linkedin.extidp.cesnet.cz"] = "LinkedIn";
        social["@twitter.extidp.cesnet.cz"] = "Twitter";
        social["@seznam.extidp.cesnet.cz"] = "Seznam";

        // Clean up extSources from the internal one
        var userExtSources = [];
        for (var i in data) {
          var obj = data[i];
          if (obj.extSource.type == 'cz.metacentrum.perun.core.impl.ExtSourceIdp')  {
            if (obj.extSource.name == 'https://extidp.cesnet.cz/idp/shibboleth') {
              var login = obj.login.split('@')[0];
              for (var s in social) {
                if (obj.login.search(s) >= 0) {
                  userExtSource = { login : login, extSource: social[s]};
                }
              }
            } else {
              userExtSource = { login : obj.login, extSource: orgs[obj.extSource.name]};
            }
            userExtSources.push(userExtSource);
          }
        }

        var table = PerunTable.create();
        table.addColumn("login", "Identita");
        table.addColumn("extSource", "Poskytovatel identity");
        
        table.add(userExtSources);
        
        var tableHtml = table.draw();
        $("#identities-table-fed").html(tableHtml);
});
