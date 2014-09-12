/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
flowMessager = new Messager($("#flowMessager"), 9000);
staticMessager = new Messager($("#staticMessager"), undefined);
function Messager(place, timeout) {
    this.place = place;
    this.timeout = timeout;
    
    this.newMessage = function (title, text, type) {
        return (new Message(title, text, type, this.place, this.timeout));
    };
}


currentMessageId = 0;
function Message(title, text, type, place, timeout) {
    currentMessageId++;
    this.id = currentMessageId;
    this.title = title;
    this.text = text;
    this.type = type;
    this.place = place;
    this.timeout = timeout;
    
    if (!this.place) {
        this.place = $("#messager");
    }
    
    this.draw = function() {
        this.place.append(
                '<div class="alert alert-' + this.type + ' alert-dismissible" role="alert" id="message' + this.id + '" >' +
                '<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>' +
                '<strong>' + this.title + '</strong> ' + this.text + ' &nbsp; ' +
                '</div>'
                );

        this.place.find("#message" + this.id).hide();
        this.place.find("#message" + this.id).show(200);
        
        if (this.timeout) {
            setTimeout(function() {
                this.place.find("#message" + this.id).hide(200);
            }.bind(this), this.timeout);
        }

    };
}


