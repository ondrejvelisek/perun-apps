/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function LoadImage(where, size) {
    this.where = where;
    this.size = size;
    
    //this.where.css("position", "relative");
    //this.where.append('<div class="load-image"><!-- <img src="'+configuration.LOADER_IMAGE+'" alt="Perun loader image"> --></div>');
    //this.where.find(".load-image").hide();
    //this.where.find(".load-image").css("width",size);
    
    
    this.show = function() {
        //this.where.find(".load-image").show();
        this.where.fadeTo( 0, 0.33 );
    };
    this.show(); 
    
    this.hide = function() {
        //this.where.find(".load-image").hide();
        this.where.fadeTo( 0, 1 );
    };  
    
     
}

