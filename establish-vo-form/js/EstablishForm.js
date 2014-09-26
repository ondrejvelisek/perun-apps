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
        
        var queue = null;
        var subject = "establishForm-subject-test";
        var text = getTextFromForm($("form#establishForm"));
        (staticMessager.newMessage(subject, text, "")).draw();
        /*
        callPerunPost("rtMessagesManager", "sentMessageToRT", {queue: queue, subject: subject, text: text}, function() {
            (flowMessager.newMessage("Application ", "was send successfully", "success")).draw();
        });*/
        
        function getTextFromForm(form) {
            var inputs = form.find("input");
            return "establishForm-text-test";
        }
    });
});