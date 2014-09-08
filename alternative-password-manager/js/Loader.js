$(document).ready(function(){
     // Hide newPassword dialog
     $("#newPassword").css('display','none');

     $("#altPasswordsLink").click(function(){

        $("#altPasswords-table").html(Configuration.LOADER_IMAGE);
        
        var attr = {};
        callPerunSync("attributesManager", "getAttribute", attr, { user : user.id, attributeName : 'urn:perun:user:attribute-def:def:altPasswords:einfra' });

        var tableHtml = "<table class=\"table table-striped table-bordered\">";
        tableHtml += "<tr><th>Password name</th><th></th></tr>";

        for (var i in attr.value) {
          tableHtml += "<tr><td>" + attr.value[i] + "</td><td><button class=\"btn btn-danger deleteAltPassword\" id=\"" + i + "\">Delete</button></td></tr>";
        }
        tableHtml += "</table>";
        
        $("#altPasswords-table").html(tableHtml);
      });

    // Default action on startup
     $("#altPasswordsLink").click();

    // Delete the password
    $('body').on('click', '.deleteAltPassword', function() {
      // Get current alt passwords names
      var altPasswordAttribute = {};
      callPerunSync("attributesManager", "getAttribute", altPasswordAttribute, { user : user.id, attributeName : "urn:perun:user:attribute-def:def:altPasswords:einfra" });

      // Remove the element from the array
      delete altPasswordAttribute.value[this.id];

      // Store the new attribute
      var data = {};
      callPerunSyncPost("attributesManager", "setAttribute", data, { user : user.id, attribute : altPasswordAttribute });
      // Reload the table
      $("#altPasswordsLink").click();
 
    });

    // Add new alternative password
    $("#addAltPassword").click(function(){

      // Get current alt passwords names
      var altPasswordAttribute = {};
      callPerunSync("attributesManager", "getAttribute", altPasswordAttribute, { user : user.id, attributeName : "urn:perun:user:attribute-def:def:altPasswords:einfra" });

      if (altPasswordAttribute.value == null) {
        altPasswordAttribute.value = {};
      }

      // Generate timestamp, it will be used as a password ID
      var timestamp = Math.round(+new Date()/1000);
      altPasswordAttribute.value[timestamp] = $("#newAltPassword")[0].value;

      // Store the new attribute
      var data = {};
      callPerunSyncPost("attributesManager", "setAttribute", data, { user : user.id, attribute : altPasswordAttribute });

      // Generate password
      // Reload the table
      $("#altPasswordsLink").click();

      $("#newPassword").css('display','block');
      $("#newPassword").html('<button type="button" class="close" data-dismiss="alert">&times;</button>New password labeled <strong>' + $("#newAltPassword")[0].value + '</strong> is <div class="alert alert-error"><p class="text-center"><strong>' + randomPassword(12) + '</strong></p></div>');
    });
});


function randomPassword(length) {
  chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  pass = "";
  for(x=0;x<length;x++)
  {
    i = Math.floor(Math.random() * chars.length);
    pass += chars.charAt(i);
  }
  return pass;
}
