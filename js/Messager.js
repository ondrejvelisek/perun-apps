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

    this.draw = function() {
        $("#messager").append(
                '<div class="alert alert-' + this.type + ' alert-dismissible" role="alert" id="message' + this.id + '" >' +
                '<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>' +
                '<strong>' + this.title + '</strong> ' + this.text +
                '</div>'
                );

        $("#messager #message" + this.id).hide();
        $("#messager #message" + this.id).show(200);
        var messageId = this.id;
        setTimeout(function() {
            $("#messager #message" + messageId).hide(200);
        }, 7000);
    };
}


