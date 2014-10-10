/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Breadcrumbs(place) {
    var that = this;
    this.place = place;
    this.items = [];
    this.selected = -1;
    
    this.pushItem = function (group) {
        this.items.push(new BreadcrumbsItem(group));
        this.selected = this.items.length-1;
        this.render();
    };
    this.showItem = function (group) {
        return this.items.pop();
        this.render();
    };
    
    this.popItemById = function (id) {
        var item;
        while (this.items.length > 0) {
            item = this.items.pop();
            if (item.item.id == id) {
                //this.items.push(item);
                this.render();
                return item.item;
            }
        }
        return null;
    };
    
    this.getItemById = function (id) {
        var item;
        for (var i in this.items) {
            item = this.items[i];
            if (item.item.id == id) {
                //this.items.push(item);
                this.render();
                return item.item;
            }
        }
        return null;
    };
    
    this.showTab = function (item) {
        for (var id in this.items) {
            if (this.items[id].item === item) {
                this.selected = id;
            }
        }
        if (item.beanName === "Vo") {
            showVo(item);
        } else {
            showGroup(item);
        }
    };
    
    this.render = function () {
        var html = '<ol class="breadcrumb">';
        for(var id in this.items) {
            html += this.items[id].getHtml(this.selected == id);
        }
        html += '</ol>';
        
        this.place.html(html);
        
        place.find("li a").click(function () {
            var id = $(this).attr("id").split("-")[1];
            var item = that.getItemById(id);
            debug(item);
            that.showTab(item);
        });
    };
}

function BreadcrumbsItem(item) {
    this.item = item;
    
    this.getHtml = function (selected) {
        var html = '<li><a';
        if (selected) {
            html += ' class="selected"';
        }
        html += ' href="#" id="breadcrumbs-'+this.item.id+'">' + this.item.shortName + '</a></li>'
        return html;
    };
}