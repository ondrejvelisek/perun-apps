/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
currentMessageId = 0;

function Message(title, text, type, place, timeout) {
    currentMessageId++;
    this.id = currentMessageId;
    this.title = title;
    this.text = text;
    this.type = type;
    this.place = place;
    this.timeout = timeout;

    this.draw = function() {
        if (!this.place) {
            this.place = $("#messager");
        }
        this.place.append(
                '<div class="alert alert-' + this.type + ' alert-dismissible" role="alert" id="message' + this.id + '" >' +
                '<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>' +
                '<strong>' + this.title + '</strong> ' + this.text + ' &nbsp; ' +
                '</div>'
                );

        $("#messager #message" + this.id).hide();
        $("#messager #message" + this.id).show(200);
        var messageId = this.id;
        if (this.timeout !== false) {
            setTimeout(function() {
                $("#messager #message" + messageId).hide(200);
            }, 9000);
        }

    };
}


