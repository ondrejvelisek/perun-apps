/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function entryPoint(user) {
}

$(document).ready(function() {
    $("form#establishForm").submit(function(e) {
        e.preventDefault();
        var form = $("form#establishForm");
        var queue = null;
        var subject = "Application for establish new VO";
        var text = getTextFromForm(form);
        form[0].reset();
        (staticMessager.newMessage(subject+"<br><br>", text, "default")).draw();
        /*
        callPerunPost("rtMessagesManager", "sentMessageToRT", {queue: queue, subject: subject, text: text}, function() {
            (flowMessager.newMessage("Application ", "was send successfully", "success")).draw();
        });*/
        
        function getTextFromForm(form) {
            var text = "";
            form.find("input, textarea").each(function() {
                text += form.find("label[for="+$(this).attr("id")+"]").text()+": ";
                text += "<strong>"+$(this).val()+"</strong><br>"
            });
            return text;
        }
    });
});