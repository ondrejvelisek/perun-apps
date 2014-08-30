/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
currentMessageId = 0;

function Message(title, text, type) {
    currentMessageId++;
    this.id = currentMessageId;
    this.title = title;
    this.text = text;
    this.type = type;
}

function drawMessage(message) {
    if (!message) {
        alert("Messager error: No message to show.");
    }
    
    $("#messager").append(
            '<div class="alert alert-'+message.type+' alert-dismissible" role="alert" id="message'+message.id+'" >' +
                '<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>' +
                '<strong>'+message.title+'</strong> '+message.text+
            '</div>'
            );
    
    $("#messager #message"+message.id).hide();
    $("#messager #message"+message.id).show(200);
    
    setTimeout(function(){$("#messager #message"+message.id).hide(200);}, 8000);
}
